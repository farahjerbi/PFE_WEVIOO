import spacy
from flask import Flask, jsonify, request
import json
import requests
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

# Load SpaCy model for preprocessing
nlp_spacy = spacy.load("en_core_web_md")

# Load BERT-based model for sentence embeddings
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

app = Flask(__name__)
CORS(app)

SIMILARITY_THRESHOLD = 0.4  # Define a similarity threshold

def preprocess_text(text):
    # Tokenize using SpaCy
    doc = nlp_spacy(text)

    # Lowercase, remove stopwords, and punctuation
    processed_tokens = [token.text.lower() for token in doc if not token.is_stop and not token.is_punct]

    # Join tokens back into a string
    processed_text = " ".join(processed_tokens)
    return processed_text

def load_config(config_file):
    with open(config_file, 'r') as file:
        config = json.load(file)
    return config

def fetch_templates_from_service(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()  # Assuming the response is in JSON format
    except requests.RequestException as e:
        print(f"Error fetching templates from {url}: {e}")
        return []

def get_all_templates(config):
    all_templates = []
    for service_key, service_url in config["template_services"].items():
        templates = fetch_templates_from_service(service_url)
        for template in templates:
            all_templates.append(template)  # Adjust based on your service response structure
    return all_templates

def get_most_similar_templates(user_description, templates):
    processed_user_desc = preprocess_text(user_description)
    user_embedding = model.encode([processed_user_desc])[0]

    similarities = []
    for template in templates:
        # Combine subject and body into a single description
        template_description = f"{template.get('subject', '')} {template.get('body', '')}".strip()
        processed_template_desc = preprocess_text(template_description)
        template_embedding = model.encode([processed_template_desc])[0]

        # Calculate cosine similarity between user description embedding and template embedding
        similarity = cosine_similarity([user_embedding], [template_embedding])[0][0]
        similarities.append((template, similarity))

    # Sort templates based on similarity scores in descending order
    similarities.sort(key=lambda x: x[1], reverse=True)

    # Filter templates that are above the similarity threshold
    top_templates = [tpl for tpl in similarities if tpl[1] >= SIMILARITY_THRESHOLD]

    # Get the top three templates
    top_three = top_templates[:3] if top_templates else []

    return top_three

@app.route('/api/search', methods=['POST'])
def search_templates():
    try:
        user_description = request.json.get('description')
        config = load_config('tsconfig.json')
        all_templates = get_all_templates(config)
        
        matched_templates = get_most_similar_templates(user_description, all_templates)

        if matched_templates:
            response = [{
                "id": template[0]['id'],
                "type": template[0]['type'],
                "name": template[0]['name'],
                "subject": template[0].get('subject'),
                "body": template[0].get('body'),
                "language": template[0].get('language')
            } for template in matched_templates]
        else:
            response = {"message": "No matching templates found."}

        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
