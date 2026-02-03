#!/bin/bash

# Étape 1 : Aller dans le dossier core et lancer la build
cd /c/windsurf/amalia/core || exit
echo "📦 Lancement de la build..."
npm run build

# Étape 2 : Aller dans le dossier dist/amalia et faire un npm link
cd dist/amalia || exit
echo "🔗 Création du lien npm..."
npm link

# Étape 3 : Aller dans le dossier du front
cd /c/windsurf/player-expert/front || exit

# Étape 4 : Trouver et tuer le processus sur le port 4201
echo "🛑 Vérification du port 4201..."

PID=$(netstat -ano | grep ':4201' | awk '{print $5}' | uniq)
if [ -n "$PID" ]; then
  echo "🔪 Arrêt du processus sur le port 4201 (PID: $PID)..."
  kill -9 "$PID"
else
  echo "✅ Aucun processus sur le port 4201."
fi

# Étape 5 : Nettoyer le cache Angular
echo "🧹 Nettoyage du cache Angular..."
ng cache clean

# Étape 6 : Lier le package @ina/amalia
echo "🔗 Liaison avec @ina/amalia..."
npm link @ina/amalia

# Étape 7 : Démarrer le projet
echo "🚀 Démarrage du projet..."
npm run start
