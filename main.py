from flask import Flask, render_template, send_from_directory, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room


app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/socket.io/*": {"origins": "*"}})

socketio = SocketIO(app)
import time

from bs4 import BeautifulSoup
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk

socketio = SocketIO(app, cors_allowed_origins="*")  # Allow connections from all origins

@socketio.on('connect')
def handle_connect():
    join_room(request.sid)

from pymongo import MongoClient

# Download NLTK resources (if not already downloaded)
nltk.download('stopwords')
nltk.download('punkt')

# Connect to MongoDB (Make sure your MongoDB server is running)
client = MongoClient("mongodb://localhost:27017/")
db = client["Database_With_Description_2"]
collection = db["inverted_index_collection"]


def preprocess_content(content):
    # Check if content is None
    if content is None:
        print("Content is None. Skipping preprocessing.")
        return None

    # Convert to lowercase
    content = content.lower()

    # Remove HTML tags using BeautifulSoup
    soup = BeautifulSoup(content, 'html.parser')
    text_content = soup.get_text()

    # Tokenize the text into individual words
    words = word_tokenize(text_content)

    # Remove stop words
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word not in stop_words]

    # Remove punctuation and special characters
    words = [word for word in words if word.isalnum()]

    # Join the processed words into a string
    preprocessed_content = ' '.join(words)

    return preprocessed_content, words


def update_inverted_index(link, words):
    for word in set(words):  # Convert to set to get unique words in the document
        collection.update_one(
            {"word": word},
            {
                "$addToSet": {
                    "info": {"link": link, "frequency": words.count(word)}
                }
            },
            upsert=True
        )


def display_inverted_index():
    print("Inverted Index:")
    for document in collection.find():
        word = document["word"]
        print(f"Word: {word}")
        for info in document["info"]:
            link = info["link"]
            frequency = info["frequency"]
            description = info.get("description", "")  # Display the first 15 words of the description
            print(f"  Link: {link}, Frequency: {frequency}, Description: {description}")



def get_documents_with_highest_frequency(query_terms):
    total_frequencies = {}

    for term in query_terms:
        document_list = collection.find_one({"word": term})
        if document_list:
            for info in document_list["info"]:
                link = info["link"]
                frequency = info["frequency"]
                total_frequencies[link] = total_frequencies.get(link, 0) + frequency

    sorted_documents = sorted(total_frequencies.items(), key=lambda x: x[1], reverse=True)
    return sorted_documents



@app.route('/')
def index():
    return render_template('index.html')
@app.route('/search', methods=['GET'])
def search():

    user_query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    results_per_page = 5

    preprocessed_query, query_terms = preprocess_content(user_query)

    start_time = time.time()

    start_index = (page - 1) * results_per_page
    end_index = start_index + results_per_page

    sorted_documents = get_documents_with_highest_frequency(query_terms)

    end_time = time.time()
    search_time = round(end_time - start_time, 2)

    results = []
    for doc in sorted_documents[start_index:end_index]:
        link = doc[0]
        frequency = doc[1]
        description = ' '.join(get_description(link).split()[:26])
        h2_heading = get_h2_heading(link)
        results.append({'link': link, 'frequency': frequency, 'description': description, 'h2_heading': h2_heading})

    response_data = {
        'results': results,
        'searchTime': search_time, # You can recalculate this if needed
        'totalResults': len(sorted_documents),
        'userQuery': user_query,
    }
    socketio.emit('results', {'results': results}, room=str(page))

    return jsonify(response_data)

# Add this function to get H2 headings from the database
def get_h2_heading(link):
    document = collection.find_one({"info.link": link})
    if document:
        info = next((info for info in document["info"] if info["link"] == link), None)
        if info:
            return info.get("h2_heading", "")
    return ""

def get_description(link):
    document = collection.find_one({"info.link": link})
    if document:
        info = next((info for info in document["info"] if info["link"] == link), None)
        if info:
            return info.get("description", "")
    return ""





@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('my-react-app/build/static', filename)


@app.route('/<path:filename>')
def serve_index(filename):
    return send_from_directory('my-react-app/build', filename)



if __name__ == '__main__':
    app.run(debug=True)