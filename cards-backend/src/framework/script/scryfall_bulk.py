import json
import os
from pathlib import Path
from typing import Dict
import requests
from tqdm import tqdm  # Importe tqdm

path_directory = '../../../src/scryfall/data'
json_file_path = f"{path_directory}/all_cards.json"


def get_card_data() -> Dict:
    os.makedirs(os.path.dirname(json_file_path), exist_ok=True)
    local_data = {}

    if Path(json_file_path).exists() and Path(json_file_path).stat().st_size != 0:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            local_data = json.load(f)

    response = requests.get('https://api.scryfall.com/bulk-data')
    bulk_data = response.json()

    if 'data' in bulk_data:
        for data in bulk_data['data']:
            if data['name'] == 'All Cards':
                link = data['download_uri']
                response = requests.get(link)
                api_data = response.json()

                # Utilise tqdm pour afficher une barre de progression
                for card in tqdm(api_data, desc="Merging cards"):
                    card_id = card.get('id', None)
                    if card_id and card_id not in local_data:
                        local_data[card_id] = card

                with open(json_file_path, 'w', encoding='utf-8') as f:
                    json.dump(local_data, f)

                return local_data

    return local_data if local_data else {}


if __name__ == "__main__":
    card_data = get_card_data()
