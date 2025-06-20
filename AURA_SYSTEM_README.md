# 🚀 Système de Surveillance Aura - LounaRail

## 📋 Vue d'ensemble

Ce système assure la stabilité et la fiabilité de l'intégration Aura dans votre site LounaRail. Avec votre abonnement Pro, vous bénéficiez d'une surveillance complète et d'un système de secours automatique.

## 🛠️ Composants du Système

### 1. **Aura Monitor** (`aura-monitor.js`)
- Surveillance en temps réel de l'iframe Aura
- Détection automatique des problèmes
- Rechargement automatique en cas d'erreur
- Logs détaillés des événements

### 2. **Aura Backup** (`aura-backup.js`)
- Système de secours avec effet de particules
- Activation automatique si Aura ne fonctionne pas
- Transition fluide entre Aura et le fallback
- Effet visuel similaire à Aura

### 3. **Panneau de Contrôle** (`aura-control-panel.html`)
- Interface de surveillance en temps réel
- Statistiques détaillées
- Contrôles manuels
- Export des logs

## 🔧 Installation

1. **Intégrer les scripts dans votre page principale :**
```html
<script src="aura-monitor.js"></script>
<script src="aura-backup.js"></script>
```

2. **Accéder au panneau de contrôle :**
Ouvrez `aura-control-panel.html` dans votre navigateur pour surveiller le système.

## 📊 Fonctionnalités

### Surveillance Automatique
- ✅ Vérification toutes les 30 secondes
- ✅ Détection des iframes manquantes
- ✅ Surveillance de la visibilité
- ✅ Contrôle de la source de l'iframe

### Système de Secours
- ✅ Effet de particules en fallback
- ✅ Activation automatique
- ✅ Transition fluide
- ✅ Notification utilisateur

### Panneau de Contrôle
- ✅ Statut en temps réel
- ✅ Statistiques détaillées
- ✅ Contrôles manuels
- ✅ Export des logs

## 🎮 Utilisation

### Commandes Console
```javascript
// Vérifier le statut
window.auraMonitor.getStats()

// Forcer le fallback (test)
window.auraBackup.forceFallback()

// Obtenir l'état du backup
window.auraBackup.getStatus()
```

### Contrôles du Panneau
- **🔄 Actualiser** : Mettre à jour le statut
- **🧪 Test Fallback** : Tester le système de secours
- **🔁 Recharger Aura** : Recharger l'iframe Aura
- **🗑️ Vider les logs** : Nettoyer les logs
- **🚨 Mode Urgence** : Désactiver Aura et activer le fallback
- **📊 Exporter Logs** : Télécharger les logs

## 📈 Métriques Surveillées

### Temps de Fonctionnement
- Suivi du temps depuis le démarrage
- Format : heures, minutes, secondes

### Erreurs Détectées
- Compteur d'erreurs système
- Logs détaillés des problèmes

### Activations Fallback
- Nombre de fois où le système de secours s'est activé
- Raisons d'activation

### Rechargements
- Nombre de rechargements automatiques d'Aura
- Suivi des interventions

## 🔍 Détection des Problèmes

### Types d'Erreurs Détectées
1. **Iframe manquante** : L'élément Aura n'est pas présent
2. **Iframe non visible** : L'iframe est présente mais invisible
3. **Source invalide** : L'URL de l'iframe est incorrecte
4. **Erreur de chargement** : Problème de réseau ou de serveur
5. **Perte de connexion** : Problème réseau

### Actions Automatiques
- **3 erreurs consécutives** → Rechargement automatique
- **Iframe manquante** → Activation du fallback
- **Problème persistant** → Notification utilisateur

## 🎨 Effet de Fallback

### Caractéristiques
- **Particules animées** : 100 particules en mouvement
- **Connexions** : Lignes entre particules proches
- **Couleurs** : Bleu/cyan avec gradient
- **Performance** : Optimisé pour 60 FPS

### Personnalisation
```javascript
// Modifier le nombre de particules
const particleCount = 150; // Dans aura-backup.js

// Changer les couleurs
this.color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`; // Bleu/cyan
```

## 📝 Logs et Debug

### Stockage des Logs
- **localStorage** : 50 dernières erreurs
- **Console** : Logs en temps réel
- **Export** : Fichier texte téléchargeable

### Format des Logs
```
[Timestamp] [Type] Message
[14:30:25] [INFO] Aura iframe chargé avec succès
[14:30:30] [ERROR] Erreur de chargement iframe
[14:30:35] [WARNING] Activation du fallback
```

## 🚨 Mode Urgence

### Activation
- Bouton "Mode Urgence" dans le panneau
- Désactivation immédiate d'Aura
- Activation du fallback
- Log de l'événement

### Utilisation
- Problèmes critiques avec Aura
- Maintenance préventive
- Tests de sécurité

## 🔧 Maintenance

### Vérifications Régulières
- **Quotidien** : Vérifier les logs d'erreur
- **Hebdomadaire** : Exporter et analyser les logs
- **Mensuel** : Tester le système de fallback

### Optimisations
- Ajuster les intervalles de vérification
- Modifier les seuils d'erreur
- Personnaliser l'effet de fallback

## 📞 Support

### En Cas de Problème
1. Vérifier le panneau de contrôle
2. Consulter les logs d'erreur
3. Tester le système de fallback
4. Exporter les logs pour analyse

### Contact
- **Aura Support** : Pour les problèmes avec Aura Pro
- **Développeur** : Pour les problèmes du système de surveillance

## 🔒 Sécurité

### Mesures de Protection
- ✅ Validation des sources d'iframe
- ✅ Isolation des erreurs
- ✅ Pas d'accès aux données sensibles
- ✅ Logs locaux uniquement

### Permissions
- **Lecture** : Statut des iframes
- **Écriture** : Logs locaux
- **Réseau** : Vérification des URLs

## 📱 Compatibilité

### Navigateurs Supportés
- ✅ Chrome (recommandé)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### Versions Minimales
- **ES6+** : Classes et arrow functions
- **Canvas API** : Pour l'effet de fallback
- **localStorage** : Pour les logs

## 🎯 Objectifs

### Performance
- Surveillance sans impact sur les performances
- Fallback fluide et rapide
- Logs optimisés

### Fiabilité
- Détection précise des problèmes
- Réaction automatique appropriée
- Système de secours fiable

### Utilisabilité
- Interface claire et intuitive
- Contrôles accessibles
- Informations détaillées

---

**Version** : 1.0  
**Dernière mise à jour** : 2024  
**Compatibilité Aura** : Pro  
**Statut** : ✅ Opérationnel 