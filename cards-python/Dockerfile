# Utilise une image Python comme image de base
FROM python:3.11-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet
COPY requirements.txt ./

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le fichier de l'application
COPY main.py ./
COPY data_fetcher.py ./
COPY routes.py ./
COPY utils.py ./
COPY websocket_client.py ./

# Exposer le port utilisé par l'application
EXPOSE 5000

# Lancer l'application
CMD ["python", "main.py"]
