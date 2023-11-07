import json
import os
import requests
from utils import streaming_download
from websocket_client import notify_server
import logging


def fetch_bulk_data():
    """Fetch the bulk data URLs from the Scryfall API"""
    api_url = "https://api.scryfall.com/bulk-data"
    response = requests.get(api_url)
    if response.status_code != 200:
        raise Exception("Failed to get data from URL")
    return response.json()["data"]


def download_and_update_json(url: str, filepath: str) -> None:
    """Download the JSON file from the given URL and update the existing JSON file"""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    temp_filepath = f"{filepath}.tmp"
    streaming_download(url, temp_filepath)
    with open(temp_filepath, 'r', encoding='utf-8') as f:
        new_data = json.load(f)
    existing_data = {}
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
    existing_data.update(new_data)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f)
    os.remove(temp_filepath)
    print("Updated data")
    notify_server()


def initial_fetch():
    """Fetch the bulk data from the Scryfall API and update the existing JSON files"""
    print("Updating data")
    try:
        bulk_urls = fetch_bulk_data()
        print(f"bulk_urls {bulk_urls}")
        # search in list of object type "all_cards"
        for bulk_data in bulk_urls:
            data_type = bulk_data['type']
            download_url = bulk_data['download_uri']
            if data_type != "all_cards":
                continue
            filepath = f"./bulk_data/{data_type}.json"
            download_and_update_json(download_url, filepath)
    except Exception as e:
        logging.error(f"Error: {e}")
