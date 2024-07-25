import spacy
from flask import Flask, jsonify, request
import json
import requests
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
import logging
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Load SpaCy model for preprocessing
nlp_spacy = spacy.load("en_core_web_md")

# Load a more robust BERT-based model for sentence embeddings
model = SentenceTransformer('all-mpnet-base-v2')

app = Flask(__name__)
CORS(app)

SIMILARITY_THRESHOLD = 0.4  # Define a similarity threshold

def preprocess_text(text):
    # Tokenize using SpaCy
    doc = nlp_spacy(text)

    # Lowercase, remove stopwords, and punctuation, and lemmatize
    processed_tokens = [token.lemma_.lower() for token in doc if not token.is_stop and not token.is_punct]

    # Join tokens back into a string
    processed_text = " ".join(processed_tokens)
    logging.debug(f"Preprocessed text: {processed_text}")
    return processed_text

def strip_html_tags(text):
    """Remove HTML tags from the text."""
    soup = BeautifulSoup(text, "html.parser")
    return soup.get_text(separator=" ")

def load_config(config_file):
    with open(config_file, 'r') as file:
        config = json.load(file)
    logging.debug(f"Loaded config: {config}")
    return config

def fetch_templates_from_service(url, template_type):
    try:
        response = requests.get(url)
        response.raise_for_status()
        templates = response.json()  # Assuming the response is in JSON format

        # Add type to each template
        for template in templates:
            template['type'] = template_type
        logging.debug(f"Fetched {len(templates)} templates from {url} with type {template_type}")
        return templates
    except requests.RequestException as e:
        logging.error(f"Error fetching templates from {url}: {e}")
        return []

def get_all_templates(config):
    all_templates = []
    for service_key, service_url in config["template_services"].items():
        template_type = service_key.split('_')[0]  # Extract type from service key
        templates = fetch_templates_from_service(service_url, template_type)
        all_templates.extend(templates)  # Add templates to the list
    logging.debug(f"Total templates fetched: {len(all_templates)}")
    return all_templates

def preprocess_template(template):
    if template['type'] == 'email':
        template_description = f"{(template.get('templateBody', '')).get('subject', '')} {(template.get('templateBody', '')).get('content', '')}".strip()
    elif template['type'] == 'push':
        template_description = f"{template.get('title', '')} {template.get('message', '')}".strip()
    elif template['type'] == 'sms':
        template_description = f"{template.get('subject', '')} {template.get('content', '')}".strip()
    else:
        template_description = ""
    
    # Strip HTML tags if present
    template_description = strip_html_tags(template_description)
    
    processed_template_desc = preprocess_text(template_description)
    logging.debug(f"Processed template description: {processed_template_desc}")
    return processed_template_desc

def get_most_similar_templates(user_description, templates):
    processed_user_desc = preprocess_text(user_description)
    user_embedding = model.encode([processed_user_desc])[0]
    logging.debug(f"User embedding: {user_embedding}")

    similarities = []
    for template in templates:
        processed_template_desc = preprocess_template(template)
        if not processed_template_desc:
            continue
        template_embedding = model.encode([processed_template_desc])[0]

        # Calculate cosine similarity between user description embedding and template embedding
        similarity = cosine_similarity([user_embedding], [template_embedding])[0][0]
        similarities.append((template, similarity))
        logging.debug(f"Similarity for template {template['id']}: {similarity}")

    # Sort templates based on similarity scores in descending order
    similarities.sort(key=lambda x: x[1], reverse=True)

    # Filter templates that are above the similarity threshold
    top_templates = [tpl for tpl in similarities if tpl[1] >= SIMILARITY_THRESHOLD]
    logging.debug(f"Top templates: {top_templates}")

    # Get the top three templates
    top_three = top_templates[:3] if top_templates else []

    return top_three

@app.route('/api/search', methods=['POST'])
def search_templates():
    try:
        user_description = request.json.get('description')
        logging.debug(f"User description: {user_description}")
        config = load_config('tsconfig.json')
        all_templates = get_all_templates(config)
        
        if not all_templates:
            return jsonify({"message": "No templates available from the services."}), 200

        matched_templates = get_most_similar_templates(user_description, all_templates)

        if matched_templates:
            response = [{
                "id": template[0]['id'],
                "type": template[0]['type'],
            } for template in matched_templates]
        else:
            response = {"message": "No matching templates found."}

        logging.debug(f"Response: {response}")
        return jsonify(response), 200
    except Exception as e:
        logging.error(f"Error in search_templates: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
