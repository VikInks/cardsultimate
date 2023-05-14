import pandas as pd


def display_csv_structure(csv_path):
    # Lire le fichier CSV
    df = pd.read_csv(csv_path)

    # Afficher la structure du CSV (nom des colonnes et type de données)
    print("Structure du fichier CSV :")
    print(df.dtypes)


# Remplacez "your_csv_file.csv" par le chemin de votre fichier CSV
csv_path = "C:/Work/cardsultimate/cards-builder/data/train/data-apr23/cards.csv"
display_csv_structure(csv_path)
