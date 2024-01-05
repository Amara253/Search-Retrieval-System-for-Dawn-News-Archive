import csv
import requests
import zipfile
import io
import time
from bs4 import BeautifulSoup
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk
from pymongo import MongoClient

from datetime import datetime, timezone, timedelta

# Download NLTK resources (if not already downloaded)
nltk.download('stopwords')
nltk.download('punkt')

# Connect to MongoDB (Make sure your MongoDB server is running)
client = MongoClient("mongodb://localhost:27017/")
db = client["Database_With_Description_2"]  # Replace "your_new_database_name" with your desired name
collection = db["inverted_index_collection"]

# Define the time threshold for reprocessing in seconds (adjust as needed)
YOUR_TIME_THRESHOLD_IN_SECONDS = 86400  # 24 hours

# Define preprocess_content function
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
def process_link(link_from_csv, description):
    # Check if the link already exists in the database
    existing_record = collection.find_one({"info.link": link_from_csv})

    if existing_record:
        # Check the timestamp of each entry in the "info" list
        for info_entry in existing_record.get("info", []):
            timestamp = info_entry.get("timestamp")
            if timestamp:
                current_time = datetime.now(timezone.utc)
                timestamp = timestamp.replace(tzinfo=timezone.utc)  # Ensure timestamp is aware of UTC
                time_difference = current_time - timestamp

                # If the record was updated recently, skip processing
                if time_difference.total_seconds() < YOUR_TIME_THRESHOLD_IN_SECONDS:
                    print(f"Skipping {link_from_csv} as it was updated recently.")
                    return

    # Print a message indicating content is being fetched
    print(f"Fetching content from {link_from_csv}")

    # Fetch content for each link
    content = get_content_from_link(link_from_csv)

    # Preprocess the content and get words
    result = preprocess_content(content)

    # Check if preprocess_content returned a valid result
    if result:
        preprocessed_content, words = result

        # Extract H2 heading from the HTML content
        soup = BeautifulSoup(content, 'html.parser')
        h2_heading = soup.find('h2', class_='story__title')
        h2_text = h2_heading.get_text() if h2_heading else ""

        # Update the inverted index
        update_inverted_index(link_from_csv, words, description, h2_text)

    # Add a delay between requests (adjust the value as needed)
    time.sleep(1)  # 1-second delay

# Modify the update_inverted_index function to accept the H2 heading
def update_inverted_index(link, words, description, h2_heading):

    description_words = description.split()[:25]
    description = ' '.join(description_words)

    for word in set(words):
        timestamp = datetime.now(timezone.utc)
        collection.update_one(
            {"word": word},
            {
                "$addToSet": {
                    "info": {"link": link, "frequency": words.count(word), "description": description,
                             "h2_heading": h2_heading, "timestamp": timestamp}
                }
            },
            upsert=True
        )

def process_link(link_from_csv, description):
    # Check if the link already exists in the database
    existing_record = collection.find_one({"info.link": link_from_csv})

    if existing_record:
        # Check the timestamp of each entry in the "info" list
        for info_entry in existing_record.get("info", []):
            timestamp = info_entry.get("timestamp")
            if timestamp:
                current_time = datetime.now(timezone.utc)
                timestamp = timestamp.replace(tzinfo=timezone.utc)  # Ensure timestamp is aware of UTC
                time_difference = current_time - timestamp

                # If the record was updated recently, skip processing
                if time_difference.total_seconds() < YOUR_TIME_THRESHOLD_IN_SECONDS:
                    print(f"Skipping {link_from_csv} as it was updated recently.")
                    return

    # Print a message indicating content is being fetched
    print(f"Fetching content from {link_from_csv}")

    # Fetch content for each link
    content = get_content_from_link(link_from_csv)

    # Preprocess the content and get words
    result = preprocess_content(content)

    # Check if preprocess_content returned a valid result
    if result:
        preprocessed_content, words = result

        # Extract the title from the HTML content within the 'story__link' class
        soup = BeautifulSoup(content, 'html.parser')
        title_tag = soup.find('a', class_='story__link')
        title_text = title_tag.get_text() if title_tag else ""

        # Update the inverted index
        update_inverted_index(link_from_csv, words, description, title_text)
    #
    # # Add a delay between requests (adjust the value as needed)
    time.sleep(1)  # 1-second delay

def display_inverted_index():
    print("Inverted Index:")
    for document in collection.find():
        word = document["word"]
        print(f"Word: {word}")
        for info in document["info"]:
            link = info["link"]
            frequency = info["frequency"]
            description = info.get("description", "")
            print(f"  Link: {link}, Frequency: {frequency}, Description: {description}")


def get_content_from_link(url):
    try:
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            return response.text
        else:
            print(f"Failed to retrieve content from {url}. Status code: {response.status_code}")
            return None
    except requests.RequestException as e:
        print(f"Error during request: {e}")
        return None


# Specify the path to your ZIP file
zip_file_path = "Dawn 2010-2021.zip"

# Open the ZIP file and iterate over CSV files
with zipfile.ZipFile(zip_file_path, 'r') as zip_file:
    for file_info in zip_file.infolist():
        with zip_file.open(file_info) as csv_file:
            # Decode bytes to string
            csv_content = io.TextIOWrapper(csv_file, encoding='utf-8').read()

            # Parse CSV content
            csv_reader = csv.reader(io.StringIO(csv_content))

            # Display the name of the CSV file
            print(f"\nProcessing CSV: {file_info.filename}\n")

            # Check if it's 2013.csv
            if file_info.filename == "2010.csv":
                # Assuming the fourth column contains links
                for row in csv_reader:
                    # Check if the row has at least 4 columns
                    if len(row) >= 4:
                        link_from_csv = row[3]  # Assuming the index is 3 (0-based index)
                        description = row[4] if len(row) >= 5 else ''  # Assuming the index is 4 (0-based index)

                        # Process the link
                        process_link(link_from_csv, description)

# Display the entire index after processing all links
display_inverted_index()