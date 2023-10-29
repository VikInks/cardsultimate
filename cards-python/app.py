from flask import Flask, jsonify
from websocket import create_connection
import json
import os
import requests
import gzip


app = Flask(__name__)


def notify_server():
    ws_url = 'ws://localhost:8081'
    ws = create_connection(ws_url)
    data = 'JSON files successfully downloaded'
    ws.send(data)
    ws.close()


def fetch_bulk_data():
    api_url = "https://api.scryfall.com/bulk-data"
    response = requests.get(api_url)
    if response.status_code != 200:
        raise Exception("Failed to get data from URL")
    bulk_data = response.json()["data"]
    target_urls = {}
    for item in bulk_data:
        if item["type"] in ["all_cards", "rulings"]:
            target_urls[item["type"]] = item["download_uri"]
    return target_urls


def streaming_download(url, filepath):
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(filepath, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)


def download_and_update_json(url: str, filepath: str) -> None:
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    temp_filepath = f"{filepath}.tmp"

    streaming_download(url, temp_filepath)

    # Load new data
    with gzip.open(temp_filepath, 'rt', encoding='utf-8') as f:
        new_data = json.load(f)

    # Load existing data if file exists
    existing_data = {}
    if os.path.exists(filepath):
        with gzip.open(filepath, 'rt', encoding='utf-8') as f:
            existing_data = json.load(f)

    # Update existing data with new data
    existing_data.update(new_data)

    # Save updated data
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
        print(f"Error: {e}")


@app.route('/update_data', methods=['POST'])
def update_data():
    try:
        bulk_urls = fetch_bulk_data()
        for data_type, url in bulk_urls.items():
            filepath = f"./bulk_data/{data_type}.json.gz"
            download_and_update_json(url, filepath)
        notify_server()
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500


if __name__ == '__main__':
    initial_fetch()
    app.run(host='0.0.0.0', port=5000, debug=True)
