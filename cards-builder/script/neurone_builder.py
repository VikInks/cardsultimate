import pandas as pd
import tensorflow as tf
from transformers import TFGPT2LMHeadModel, GPT2Tokenizer, GPT2Config

# Paramètres
BATCH_SIZE = 10000
number_of_epochs = 5
number_of_steps_per_epoch = 100
number_of_evaluation_steps = 50
deck_csv_path = "C:/Work/cardsultimate/cards-builder/data/train/data-apr23/decks.csv"
card_csv_path = "C:/Work/cardsultimate/cards-builder/data/train/data-apr23/cards.csv"


# Vérifier si le GPU est disponible et l'utiliser
if tf.config.list_physical_devices('GPU'):
    tf.config.experimental.set_memory_growth(tf.config.list_physical_devices('GPU')[0], True)
    print("GPU is available")
else:
    print("GPU is not available")


# 1. Lire et pré-traiter les données par lots
def read_csv_in_batches(csv_path, batch_size=BATCH_SIZE):
    chunks = pd.read_csv(csv_path, chunksize=batch_size)
    for chunk in chunks:
        yield chunk


def preprocess_data(chunk):
    chunk.dropna(inplace=True)

    if 'commander' in chunk.columns:
        chunk['commander'] = chunk['commander'].str.lower()
    if 'card' in chunk.columns:
        chunk['card'] = chunk['card'].str.lower()

    return chunk


# 2. Créer des générateurs pour l'entraînement et l'évaluation
def deck_generator(deck_csv_path, card_csv_path, tokenizer, batch_size=BATCH_SIZE):
    while True:
        for decks_chunk, cards_chunk in zip(read_csv_in_batches(deck_csv_path, batch_size),
                                            read_csv_in_batches(card_csv_path, batch_size)):
            decks_chunk = preprocess_data(decks_chunk)
            cards_chunk = preprocess_data(cards_chunk)

            # Créer un dictionnaire pour stocker les listes de cartes de chaque deck
            decklists = {}
            for _, row in cards_chunk.iterrows():
                urlhash = row['url']
                card_name = row['card']
                if urlhash not in decklists:
                    decklists[urlhash] = []
                decklists[urlhash].append(card_name)

            # Préparer les entrées et les sorties du modèle
            input_texts = []
            target_texts = []
            for urlhash, decklist in decklists.items():
                for i in range(len(decklist) - 1):
                    input_texts.append(decklist[i])
                    target_texts.append(decklist[i + 1])

            input_encodings = tokenizer(input_texts, return_tensors='tf', padding=True, truncation=True)
            target_encodings = tokenizer(target_texts, return_tensors='tf', padding=True, truncation=True)

            yield input_encodings, target_encodings


# 3. Charger et adapter le modèle GPT-2
config = GPT2Config.from_pretrained("gpt2", use_auth_token=True)
tokenizer = GPT2Tokenizer.from_pretrained("gpt-2")
model = TFGPT2LMHeadModel.from_pretrained("gpt-2", config=config)

# 4. Préparer les générateurs pour l'entraînement et l'évaluation
train_gen = deck_generator(deck_csv_path, card_csv_path, tokenizer)
eval_gen = deck_generator(deck_csv_path, card_csv_path, tokenizer)

# 5. Entraîner et évaluer le modèle avec les générateurs
model.fit(train_gen, epochs=number_of_epochs, steps_per_epoch=number_of_steps_per_epoch)
evaluation_metrics = model.evaluate(eval_gen, steps=number_of_evaluation_steps)
print(evaluation_metrics)
