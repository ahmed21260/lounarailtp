// Fichier: assets/js/config.js
// Ce fichier centralise la configuration et les utilitaires globaux du site.

// S'assure que l'objet AURA existe sur l'objet window
window.AURA = window.AURA || {};

const config = {
    debugMode: true, // Mettre à false en production pour cacher les logs détaillés
};

/**
 * Gestionnaire d'erreurs centralisé.
 * Affiche un message convivial à l'utilisateur et logue les détails techniques.
 * @param {Error} error - L'objet d'erreur capturé.
 * @param {string} context - Le contexte où l'erreur s'est produite (ex: "rendu de la galerie").
 */
function handleError(error, context) {
    console.error(`[ERREUR | ${context}]`, error);
    
    // Tente d'afficher un toast si la fonction existe
    if (typeof showToast === 'function') {
        showToast(
            "Une erreur est survenue",
            `Un problème technique est apparu dans la section : ${context}. L'équipe technique est prévenue.`,
            "error"
        );
    }
}

/**
 * Utilitaire de log en mode debug.
 * @param {string} message - Le message à logger.
 * @param {*} [data] - Données optionnelles à logger.
 */
function logDebug(message, data = '') {
    if (config.debugMode) {
        console.log(`[DEBUG] ${message}`, data);
    }
}

window.AURA.init = () => {
    console.log(`AURA Engine v${window.AURA.version} initialized.`);
    console.log(`Debug Mode: ${window.AURA.debug ? 'ON' : 'OFF'}.`);
    // Initialiser le journal des erreurs
    window.AURA.errorLog = [];
    window.onerror = function(message, source, lineno, colno, error) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            message,
            source,
            lineno,
            colno,
            error: error ? error.stack : 'N/A'
        };
        window.AURA.errorLog.push(errorEntry);
        console.error("AURA Catcher:", errorEntry);
        // On ne retourne plus 'true' pour ne pas bloquer le gestionnaire d'erreurs par défaut du navigateur.
        // Cela assure que les autres scripts continuent de s'exécuter même si une erreur est capturée.
        return false; 
    };
};

// Auto-initialisation
window.AURA.init(); 