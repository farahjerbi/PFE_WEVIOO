import spacy
from flask import Flask, jsonify, request
import json
import psycopg2
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity  # Import cosine_similarity
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

def get_db_connection(db_config):
    conn = psycopg2.connect(
        dbname=db_config["dbname"],
        user=db_config["user"],
        password=db_config["password"],
        host=db_config["host"],
        port=db_config["port"]
    )
    return conn

def fetch_email_templates(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT et.id, et.name, tb.subject, tb.content AS body, et.language, 'email' as type
            FROM email_template et
            JOIN template_body tb ON et.template_body_id = tb.id
        """)
        templates = cursor.fetchall()
        cursor.close()
        return templates
    except psycopg2.Error as e:
        print(f"Error fetching email templates: {e}")
        return []

def fetch_sms_templates(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, subject, content AS body, language, 'sms' as type
            FROM sms_template
        """)
        templates = cursor.fetchall()
        cursor.close()
        return templates
    except psycopg2.Error as e:
        print(f"Error fetching SMS templates: {e}")
        return []

def fetch_push_templates(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, title AS name, message AS body, 'push' as type
            FROM web_push_message
        """)
        templates = cursor.fetchall()
        cursor.close()
        return templates
    except psycopg2.Error as e:
        print(f"Error fetching push templates: {e}")
        return []

def get_all_templates(config):
    all_templates = []
    for db_key, db_config in config["databases"].items():
        conn = get_db_connection(db_config)
        if db_key == "email_db":
            templates = fetch_email_templates(conn)
        elif db_key == "sms_db":
            templates = fetch_sms_templates(conn)
        elif db_key == "push_db":
            templates = fetch_push_templates(conn)
        for template in templates:
            all_templates.append(template + (db_key,))
        conn.close()
    return all_templates

def get_most_similar_templates(user_description, templates):
    processed_user_desc = preprocess_text(user_description)
    user_embedding = model.encode([processed_user_desc])[0]

    similarities = []
    for template in templates:
        # Combine subject and body into a single description
        template_description = f"{template[2] if template[2] else ''} {template[3] if template[3] else ''}".strip()
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
                "id": template[0][0],
                "type": template[0][-1],
                "name": template[0][1],
                "subject": template[0][2],
                "body": template[0][3] if len(template[0]) > 3 else None,
                "language": template[0][4]
            } for template in matched_templates]
        else:
            response = {"message": "No matching templates found."}

        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
