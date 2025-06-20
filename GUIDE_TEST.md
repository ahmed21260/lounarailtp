# Guide de Test et Documentation du Site Louna Rail TP

Ce document sert de guide pour vérifier le bon fonctionnement du site et comprendre sa structure de base.

---

## 1. Comment Tester le Site (Checklist Manuelle)

Après chaque modification importante, suivez ces étapes pour vous assurer que rien n'est cassé.

### Page d'Accueil (`index.html` -> `lounarailtp.html`)
- [ ] **Test 1 :** Ouvrir la page d'accueil (`http://localhost:8000`).
- [ ] **Résultat Attendu :** L'écran d'accueil avec le fond animé, le logo et le texte s'affiche correctement.
- [ ] **Test 2 :** Passer la souris sur le fond.
- [ ] **Résultat Attendu :** L'animation réagit au mouvement de la souris.
- [ ] **Test 3 :** Cliquer sur le bouton "ENTRER SUR LE SITE" ou "Explorer".
- [ ] **Résultat Attendu :** L'écran d'accueil disparaît en fondu et la page principale (`lounarailtp.html`) s'affiche.

### Page Principale (`lounarailtp.html`)
- [ ] **Test 4 :** Ouvrir les accordéons "Nos Prestations", "Location", et "Formation" un par un.
- [ ] **Résultat Attendu :** Chaque accordéon s'ouvre et se ferme correctement. Le contenu s'affiche :
    - **Prestations :** La mini-galerie des 3 réalisations est visible.
    - **Location & Formation :** Les listes de services sont visibles.
- [ ] **Test 5 :** Cliquer sur le bouton "Nous joindre" ou un lien vers le contact.
- [ ] **Résultat Attendu :** L'accordéon "Contact" s'ouvre et affiche le formulaire.
- [ ] **Test 6 :** Remplir et envoyer le formulaire de contact (test).
- [ ] **Résultat Attendu :** Un message de succès ou d'erreur s'affiche.

### Page Formations (`formations.html`)
- [ ] **Test 7 :** Ouvrir la page Formations.
- [ ] **Résultat Attendu :** La page se charge correctement.
- [ ] **Test 8 :** Cliquer sur le menu déroulant des formations.
- [ ] **Résultat Attendu :** La liste complète des formations (Pack Engcon, CACES, etc.) s'affiche, triée par ordre alphabétique.
- [ ] **Test 9 :** Remplir et envoyer le formulaire de demande de formation.
- [ ] **Résultat Attendu :** Un message de succès ou d'erreur s'affiche.

---

## 2. Structure du Projet

- **`index.html`** : C'est la porte d'entrée du site (l'écran d'accueil animé). Il redirige vers `lounarailtp.html`.
- **`lounarailtp.html`** : C'est la page d'accueil principale avec les accordéons.
- **`formations.html`, `prestation.html`, etc.** : Ce sont les pages de contenu spécifiques.
- **`maintenance.html`** : Votre **tableau de bord** pour vérifier la santé du site et faire des sauvegardes.
- **`/assets/js/database.js`** : C'est le **cerveau** du site. Toutes les informations sur les formations, prestations, réalisations, etc., sont stockées ici. **C'est le fichier le plus important à sauvegarder.**
- **`/assets/js/config.js`** : Fichier de configuration pour la gestion des erreurs.
- **`/images/`** : Dossier contenant toutes les images du site.
- **`/assets/css/`** : Contient les feuilles de style CSS.

---

## 3. En Cas de Problème

1.  **Ouvrez la page `maintenance.html`** pour lancer un diagnostic automatique. Cela vous dira si des fichiers ou des données sont manquants.
2.  **Ouvrez la console du navigateur** (clic droit -> "Inspecter" -> onglet "Console") pour voir s'il y a des messages d'erreur en rouge. Le gestionnaire d'erreur que j'ai installé y affichera des informations précieuses.
3.  **Restaurez une sauvegarde** de `database.js` si le problème vient de ce fichier.

## 🚀 Checklist de Déploiement en Production

Avant de mettre le site en ligne, suivez ces étapes cruciales pour la sécurité et la performance.

### 1. Configuration de l'Environnement
- **`[CRUCIAL]`** Assurez-vous que le fichier `.env` sur le serveur de production ne contient **PAS** la ligne `DEBUG=True`. Le mode débug ne doit JAMAIS être activé en production.
- **`[CRUCIAL]`** Vérifiez que le fichier `.env` contient les bons identifiants email de production.
- **`[RECOMMANDÉ]`** Utilisez une `SECRET_KEY` forte et unique dans votre fichier `.env` de production. Vous pouvez en générer une avec `python -c 'import secrets; print(secrets.token_hex())'`.

### 2. Lancement du Serveur
- **`[CRUCIAL]`** N'utilisez **PAS** le serveur de développement Flask (`python server.py`) pour la production. Il n'est ni sécurisé, ni performant.
- **`[RECOMMANDÉ]`** Utilisez un serveur WSGI de production comme **Gunicorn** ou **Waitress**.
    - **Exemple avec Waitress (Windows & Linux) :**
        1. Installez Waitress : `pip install waitress`
        2. Lancez le serveur : `waitress-serve --host 0.0.0.0 --port 8000 server:app`
    - **Exemple avec Gunicorn (Linux) :**
        1. Installez Gunicorn : `pip install gunicorn`
        2. Lancez le serveur : `gunicorn --bind 0.0.0.0:8000 --workers 4 server:app`

### 3. Tests Finaux
- Une fois le site en ligne, re-testez les formulaires de contact et d'inscription pour vous assurer que l'envoi d'emails fonctionne sur le serveur de production.
- Vérifiez que toutes les pages se chargent correctement et que les redirections fonctionnent.
- Utilisez la page `maintenance.html` une dernière fois pour un diagnostic final sur l'environnement de production. 