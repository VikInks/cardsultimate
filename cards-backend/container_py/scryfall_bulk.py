import json
import os
import argparse
import requests

from tqdm import tqdm
from typing import Dict

json_file_path = "../../../src/scryfall/data/all_cards.json"


def get_card_data(url: str) -> Dict:
    os.makedirs(os.path.dirname(json_file_path), exist_ok=True)
    local_data = {}

    response = requests.get(url)
    api_data = response.json()

    for card in tqdm(api_data, desc="Merging cards"):
        card_id = card.get('id', None)
        if card_id and card_id not in local_data:
            local_data[card_id] = card

    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(local_data, f)

    return local_data if local_data else {}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Download JSON data from a URL.')
    parser.add_argument('url', type=str, help='The URL to fetch data from.')
    args = parser.parse_args()

    card_data = get_card_data(args.url)
