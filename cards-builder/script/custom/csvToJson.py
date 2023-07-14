import pathlib
import pandas as pd
from tqdm import tqdm

csv = {
    'csv1': pathlib.Path("../../data/train/data-apr23/cards.csv"),
    'csv2': pathlib.Path("../../data/train/data-apr23/decks.csv"),
    'csv3': pathlib.Path("../../data/train/data-apr23/decks_w_cards.csv")
}

json = {
    'json1': "cards.json",
    'json2': "decks.json",
    'json3': "decks_w_cards.json"
}

for key, value in csv.items():
    json_key = key.replace('csv', 'json')

    # Étape 1: Lire un échantillon du fichier CSV pour déterminer les colonnes et les types de données
    sample_size = 1000
    sample_df = pd.read_csv(value, engine='python', nrows=sample_size)

    # Étape 2: Utiliser les noms de colonnes et les types de données pour lire le fichier CSV complet
    columns_to_read = sample_df.columns.tolist()
    data_types = sample_df.convert_dtypes().dtypes.to_dict()

    # Estimer le nombre total de lignes dans le fichier CSV
    total_lines = sum(1 for _ in open(value, 'r', encoding='utf-8')) - 1  # Soustraire 1 pour les en-têtes de colonnes

    # Lire le fichier CSV en morceaux et utiliser tqdm pour afficher la progression
    chunksize = 10**4
    progress_bar = tqdm(total=total_lines, unit="lines", desc=f"Processing {key}")
    result_df = pd.DataFrame()

    for chunk in pd.read_csv(value, engine='python', usecols=columns_to_read, dtype=data_types, chunksize=chunksize):
        result_df = pd.concat([result_df, chunk], ignore_index=True)
        progress_bar.update(chunk.shape[0])

    progress_bar.close()

    # Sauvegarder le résultat dans un fichier JSON
    result_df.to_json(json[json_key], orient='records')
    with open(json[json_key], 'w') as f:
        f.write(result_df.to_json(orient='records', lines=True))
