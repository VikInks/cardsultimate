# Utilise une image Python comme image de base
FROM python:3.11-alpine

# Définir le répertoire de travail
WORKDIR /container_py

# Installer les dépendances système si nécessaire
# RUN apk add --no-cache <nom_du_paquet>

# Copier les fichiers du projet
COPY requirements.txt ./

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le fichier de l'application
COPY app.py ./

# Exposer le port utilisé par l'application
EXPOSE 5000

# Lancer l'application
CMD ["python", "app.py"]
