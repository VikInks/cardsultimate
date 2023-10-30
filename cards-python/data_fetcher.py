import json
import os
import requests
import gzip
from utils import streaming_download
from websocket_client import notify_server
import logging


def fetch_bulk_data():
    api_url = "https://api.scryfall.com/bulk-data"
    response = requests.get(api_url)
    if response.status_code != 200:
        raise Exception("Failed to get data from URL")
    return response.json()["data"]


def download_and_update_json(url: str, filepath: str) -> None:
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    temp_filepath = f"{filepath}.tmp"
    streaming_download(url, temp_filepath)
    with gzip.open(temp_filepath, 'rt', encoding='utf-8') as f:
        new_data = json.load(f)
    existing_data = {}
    if os.path.exists(filepath):
        with gzip.open(filepath, 'rt', encoding='utf-8') as f:
            existing_data = json.load(f)
    existing_data.update(new_data)
    with gzip.open(filepath, 'wt', encoding='utf-8') as f:
        json.dump(existing_data, f)
    os.remove(temp_filepath)


def initial_fetch():
    try:
        bulk_urls = fetch_bulk_data()
        for data_type, url in bulk_urls.items():
            filepath = f"./bulk_data/{data_type}.json.gz"
            download_and_update_json(url, filepath)
        notify_server()
    except Exception as e:
        logging.error(f"Error: {e}")
