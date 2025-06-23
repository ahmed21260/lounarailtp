// SYSTÈME DE SURVEILLANCE RÉSEAU LOUNA RAIL TP
// © 2025 Ahmed Chaira - Tous droits réservés

class SurveillanceSystem {
    constructor() {
        this.violations = [];
        this.startTime = new Date();
        this.sessionId = this.generateSessionId();
        this.serverUrl = this.getServerUrl();
        this.isOnline = navigator.onLine;
        this.pendingViolations = [];
        this.ignoreNextPopstate = false; // Pour ignorer la navigation via les ancres
        this.isInternalNavigation = false; // Pour ignorer la sortie de page normale
        this.init();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getServerUrl() {
        // URL du serveur de surveillance (à adapter selon votre déploiement)
        const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
        const host = window.location.hostname;
        const port = '5001'; // Port du serveur de surveillance
        return `${protocol}//${host}:${port}`;
    }

    init() {
        this.setupEventListeners();
        this.setupNetworkMonitoring();
        this.logActivity('SURVEILLANCE_ACTIVATED', 'Système de surveillance réseau activé');
        console.warn('🚨 SYSTÈME DE SURVEILLANCE RÉSEAU ACTIF - Toute infraction sera enregistrée et transmise');
        
        // Envoi des violations en attente si reconnecté
        if (this.isOnline && this.pendingViolations.length > 0) {
            this.sendPendingViolations();
        }
    }

    setupNetworkMonitoring() {
        // Surveillance de la connectivité réseau
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.logActivity('NETWORK_ONLINE', 'Connexion réseau rétablie');
            this.sendPendingViolations();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.logActivity('NETWORK_OFFLINE', 'Connexion réseau perdue');
        });

        // Surveillance des changements de page (uniquement si ce n'est pas une navigation interne)
        window.addEventListener('beforeunload', () => {
            if (this.isInternalNavigation) {
                this.isInternalNavigation = false; // On réinitialise
                return; // On n'enregistre pas la violation
            }
            this.recordViolation('PAGE_LEAVE', {
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
        });

        // Surveillance des tentatives de navigation (popstate pour back/forward)
        window.addEventListener('popstate', () => {
            if (this.ignoreNextPopstate) {
                this.ignoreNextPopstate = false;
                console.log("Ignoré : Navigation d'ancre interne.");
                return;
            }
            this.recordViolation('NAVIGATION_ATTEMPT', {
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
        });
    }

    setupEventListeners() {
        // Détection clic sur les ancres et les liens internes
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                // Si c'est un lien d'ancre interne (#)
                if (link.getAttribute('href')?.startsWith('#')) {
                    this.ignoreNextPopstate = true;
                    setTimeout(() => { this.ignoreNextPopstate = false; }, 150);
                }
                // Si c'est un lien vers le même site
                if (link.hostname === window.location.hostname) {
                    this.isInternalNavigation = true;
                }
            }
        }, true);

        // Détection clic droit
        document.addEventListener('contextmenu', (e) => {
            this.recordViolation('CLIC_DROIT', {
                target: e.target.tagName,
                className: e.target.className,
                id: e.target.id,
                x: e.clientX,
                y: e.clientY,
                timestamp: new Date().toISOString()
            });
        });

        // Détection copie (Ctrl+C)
        document.addEventListener('copy', (e) => {
            this.recordViolation('TENTATIVE_COPIE', {
                selection: window.getSelection().toString().substring(0, 100),
                timestamp: new Date().toISOString()
            });
        });

        // Détection capture d'écran (PrtScn)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                this.recordViolation('TENTATIVE_CAPTURE', {
                    key: e.key,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Détection outils de développement
        let devtools = { open: false, orientation: null };
        setInterval(() => {
            const threshold = 160;
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    this.recordViolation('OUTILS_DEVELOPPEMENT', {
                        timestamp: new Date().toISOString()
                    });
                }
            } else {
                devtools.open = false;
            }
        }, 1000);

        // Détection tentatives de drag & drop d'images
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                this.recordViolation('TENTATIVE_DRAG_IMAGE', {
                    src: e.target.src,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Surveillance des tentatives de téléchargement
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG' && e.ctrlKey) {
                this.recordViolation('TENTATIVE_TELECHARGEMENT_CTRL_CLICK', {
                    src: e.target.src,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Détection tentatives de sélection de texte (DÉSACTIVÉ CAR TROP SENSIBLE)
        /*
        document.addEventListener('selectstart', (e) => {
            this.recordViolation('TENTATIVE_SELECTION', {
                target: e.target.tagName,
                timestamp: new Date().toISOString()
            });
        });
        */

        // Détection tentatives de sauvegarde (Ctrl+S)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.recordViolation('TENTATIVE_SAUVEGARDE', {
                    key: 'Ctrl+S',
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Détection tentatives d'impression (Ctrl+P)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                this.recordViolation('TENTATIVE_IMPRESSION', {
                    key: 'Ctrl+P',
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Surveillance des tentatives de zoom
        document.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                this.recordViolation('TENTATIVE_ZOOM', {
                    delta: e.deltaY,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Détection tentatives de clic droit sur vidéos
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'VIDEO') {
                this.recordViolation('CLIC_DROIT_VIDEO', {
                    src: e.target.src,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    recordViolation(type, details) {
        const violation = {
            type: "security", // On définit le type pour notre API de notification
            data: {
                type: type,
                page: window.location.href,
                message: JSON.stringify(details, null, 2)
                // L'IP sera ajoutée par le serveur
            }
        };

        this.logViolation(type, details); // On garde le log en console
        this.sendToServer(violation);
    }

    logViolation(type, details) {
        const fullViolationDetails = {
            type: type,
            details: details,
            sessionId: this.sessionId,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString(),
        };
        console.error('🚨 VIOLATION RÉSEAU DÉTECTÉE:', fullViolationDetails);
        
        // Affichage d'un avertissement visuel
        this.showWarning(type);
        
        // Log local pour sauvegarde
        // this.storeLocally(violation); // Désactivé pour l'instant
    }

    showWarning(type) {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff0000;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        warning.innerHTML = `
            🚨 VIOLATION DÉTECTÉE<br>
            Type: ${type}<br>
            Enregistrée et transmise<br>
            <small>© Louna Rail TP</small>
        `;
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            warning.remove();
        }, 3000);
    }

    async sendToServer(violation) {
        if (!navigator.onLine) {
            this.pendingViolations.push(violation);
            return;
        }

        try {
            const response = await fetch(`/api/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(violation),
            });

            if (!response.ok) {
                console.warn(`Erreur envoi violation (${response.status})`);
            }
        } catch (error) {
            console.error('❌ Erreur réseau:', error);
            this.pendingViolations.push(violation);
        }
    }

    async sendPendingViolations() {
        if (this.pendingViolations.length === 0) return;

        console.log(`📤 Envoi de ${this.pendingViolations.length} violations en attente...`);
        
        for (const violation of this.pendingViolations) {
            await this.sendToServer(violation);
        }
        
        this.pendingViolations = [];
    }

    storeLocally(violation) {
        try {
            const stored = JSON.parse(localStorage.getItem('lounarail_violations') || '[]');
            stored.push(violation);
            localStorage.setItem('lounarail_violations', JSON.stringify(stored));
        } catch (error) {
            console.error('Erreur stockage local:', error);
        }
    }

    logActivity(action, message) {
        console.log(`[LOUNA RAIL SURVEILLANCE RÉSEAU] ${action}: ${message}`);
    }

    getViolations() {
        return this.violations;
    }

    getSessionInfo() {
        return {
            sessionId: this.sessionId,
            startTime: this.startTime,
            violationsCount: this.violations.length,
            pendingCount: this.pendingViolations.length,
            userAgent: navigator.userAgent,
            url: window.location.href,
            isOnline: this.isOnline,
            serverUrl: this.serverUrl
        };
    }

    // Méthode pour obtenir les statistiques du serveur
    async getServerStats() {
        try {
            const response = await fetch(`${this.serverUrl}/api/surveillance/stats`);
            return await response.json();
        } catch (error) {
            console.error('Erreur récupération stats:', error);
            return null;
        }
    }
}

// Initialisation du système de surveillance réseau
document.addEventListener('DOMContentLoaded', () => {
    window.lounaRailSurveillance = new SurveillanceSystem();
    
    // Affichage de l'avertissement de surveillance réseau
    setTimeout(() => {
        console.warn(`
🚨 SYSTÈME DE SURVEILLANCE RÉSEAU LOUNA RAIL TP ACTIVÉ 🚨

© 2025 Ahmed Chaira - Tous droits réservés

📊 SURVEILLANCE RÉSEAU COMPLÈTE :
• Toute tentative de copie, reproduction ou ingénierie inverse sera :
  - Enregistrée automatiquement
  - Transmise au serveur centralisé
  - Conservée dans nos bases de données  
  - Transmise aux autorités compétentes
  - Faisant l'objet de poursuites judiciaires

🌐 VOTRE SESSION EST SURVEILLÉE ET ENREGISTRÉE
📧 ALERTES AUTOMATIQUES : contact@lounarailtp.com
        `);
    }, 2000);
});

// Protection contre la désactivation
Object.freeze(window.lounaRailSurveillance); 