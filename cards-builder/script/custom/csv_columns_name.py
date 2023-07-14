import pathlib
import pandas as pd

cards = pathlib.Path("../../data/train/data-apr23/cards.csv")
decks = pathlib.Path("../../data/train/data-apr23/decks.csv")
decks_w_cards = pathlib.Path("../../data/train/data-apr23/decks_w_cards.csv")


def combine_csv_files(filenames):
    # Charger uniquement les informations sur les colonnes du premier fichier CSV
    combined_df = pd.read_csv(filenames[0], nrows=0)

    # Charger uniquement les informations sur les colonnes des fichiers CSV restants et les concaténer
    for filename in filenames[1:]:
        temp_df = pd.read_csv(filename, nrows=0)
        combined_df = pd.concat([combined_df, temp_df], ignore_index=True)

    return combined_df


if __name__ == "__main__":
    csv_files = [
        cards,
        decks,
        decks_w_cards
    ]

    combined_df = combine_csv_files(csv_files)

    # Afficher les noms de colonnes
    print(combined_df.columns)
