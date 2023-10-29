# Utilisez une image Node.js LTS comme image de base
FROM node:lts

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet
COPY package*.json tsconfig.json ./
COPY src ./src

# Installer les dépendances
RUN npm install

# Installer les dépendances de compilation pour bcrypt
RUN apt-get update && apt-get install -y build-essential python

# Reconstruire bcrypt pour l'environnement actuel
RUN npm rebuild bcrypt --build-from-source

# Installer nodemon globalement
RUN npm install -g nodemon

# Exposer le port utilisé par l'application
EXPOSE 8000

# Lancer l'application
CMD ["npm", "run", "start"]
