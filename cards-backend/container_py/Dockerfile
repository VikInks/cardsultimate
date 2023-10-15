# Utilise une image Python comme image de base
FROM python:3.11-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet
COPY requirements.txt ./
COPY app.py ./

# Installer les dépendances
RUN pip install Requests
RUN pip install Flask

# Exposer le port utilisé par l'application
EXPOSE 5000

# Lancer l'application
CMD ["python", "app.py"]
