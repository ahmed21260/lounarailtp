from server import app
from flask import request, send_from_directory
import os

# Configuration pour Vercel
app.debug = False

# Route pour servir les fichiers statiques
@app.route('/<path:path>')
def serve_static(path):
    # Vérifier si le fichier existe dans le répertoire racine
    if os.path.exists(path):
        return send_from_directory('.', path)
    # Sinon, laisser Flask gérer
    return app.send_static_file(path)

# Route racine
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# Export pour Vercel
if __name__ == '__main__':
    app.run() 