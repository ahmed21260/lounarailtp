// Aura Monitor - Surveillance de l'iframe Aura
class AuraMonitor {
    constructor() {
        this.auraIframe = null;
        this.lastCheck = Date.now();
        this.errorCount = 0;
        this.maxErrors = 3;
        this.checkInterval = 30000; // 30 secondes
        this.init();
    }

    init() {
        this.auraIframe = document.querySelector('iframe[src*="aurachat.io"]');
        if (this.auraIframe) {
            this.startMonitoring();
            this.setupEventListeners();
        }
    }

    startMonitoring() {
        setInterval(() => {
            this.checkAuraHealth();
        }, this.checkInterval);
    }

    setupEventListeners() {
        // Surveiller les erreurs de chargement
        this.auraIframe.addEventListener('error', (e) => {
            this.handleError('Erreur de chargement iframe', e);
        });

        // Surveiller les changements de contenu
        this.auraIframe.addEventListener('load', () => {
            this.log('Aura iframe chargé avec succès');
        });

        // Surveiller les erreurs réseau
        window.addEventListener('online', () => {
            this.log('Connexion réseau rétablie');
        });

        window.addEventListener('offline', () => {
            this.handleError('Connexion réseau perdue');
        });
    }

    checkAuraHealth() {
        try {
            // Vérifier si l'iframe est toujours présent
            if (!this.auraIframe || !this.auraIframe.parentNode) {
                this.handleError('Iframe Aura manquante');
                return;
            }

            // Vérifier si l'iframe est visible
            const rect = this.auraIframe.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                this.handleError('Iframe Aura non visible');
                return;
            }

            // Vérifier la source de l'iframe
            const src = this.auraIframe.src;
            if (!src || !src.includes('aurachat.io')) {
                this.handleError('Source iframe Aura invalide');
                return;
            }

            this.log('Aura iframe en bonne santé');
            this.errorCount = 0; // Reset error count on success

        } catch (error) {
            this.handleError('Erreur lors de la vérification', error);
        }
    }

    handleError(message, error = null) {
        this.errorCount++;
        console.error(`[Aura Monitor] ${message}`, error);
        
        // Log détaillé
        this.logError({
            timestamp: new Date().toISOString(),
            message: message,
            error: error?.message || error,
            errorCount: this.errorCount,
            iframeSrc: this.auraIframe?.src,
            iframeVisible: this.auraIframe ? this.auraIframe.getBoundingClientRect() : null
        });

        // Si trop d'erreurs, essayer de recharger
        if (this.errorCount >= this.maxErrors) {
            this.reloadAura();
        }
    }

    reloadAura() {
        try {
            this.log('Tentative de rechargement de l\'iframe Aura');
            const currentSrc = this.auraIframe.src;
            this.auraIframe.src = '';
            setTimeout(() => {
                this.auraIframe.src = currentSrc;
                this.errorCount = 0;
            }, 1000);
        } catch (error) {
            console.error('[Aura Monitor] Erreur lors du rechargement:', error);
        }
    }

    log(message) {
        console.log(`[Aura Monitor] ${message}`);
    }

    logError(errorData) {
        // Sauvegarder les erreurs dans localStorage pour debug
        const errors = JSON.parse(localStorage.getItem('aura_errors') || '[]');
        errors.push(errorData);
        if (errors.length > 50) errors.shift(); // Garder seulement les 50 dernières erreurs
        localStorage.setItem('aura_errors', JSON.stringify(errors));
    }

    // Méthode pour obtenir les statistiques
    getStats() {
        return {
            errorCount: this.errorCount,
            lastCheck: this.lastCheck,
            iframePresent: !!this.auraIframe,
            iframeSrc: this.auraIframe?.src
        };
    }
}

// Initialiser le monitoring
document.addEventListener('DOMContentLoaded', () => {
    window.auraMonitor = new AuraMonitor();
});

// Exposer pour debug
window.AuraMonitor = AuraMonitor; 