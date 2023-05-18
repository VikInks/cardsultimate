#!/usr/bin/env python3

import os
import subprocess
import sys
import shutil

# Vérifier si dos2unix est installé
if not shutil.which("dos2unix"):
    print("dos2unix not found. Attempting to install...")
    os.system("sudo apt-get update && sudo apt-get install dos2unix")

# Vérifier à nouveau si dos2unix est installé
if not shutil.which("dos2unix"):
    print("Failed to install dos2unix. Exiting.")
    sys.exit(1)

# Configuration de git pour utiliser LF comme séparateur de ligne par défaut
os.system("git config --global core.eol lf")
os.system("git config --global core.autocrlf input")

# Récupérer tous les fichiers non ignorés par .gitignore
result = subprocess.run(["git", "ls-files", "-z"], capture_output=True, text=True)

# Conversion de tous les fichiers de CRLF à LF
for file in result.stdout.split('\0'):
    if file:  # Ignore empty strings
        os.system(f"dos2unix {file}")
