/**
 * Louna Rail TP - Système de Tracking des Visiteurs
 * © 2025 Ahmed Chaira - Tous droits réservés
 */

class VisitorTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageViews = [];
    this.isTracking = false;
    this.apiEndpoint = '/api/visitors';
    
    this.init();
  }

  init() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startTracking());
    } else {
      this.startTracking();
    }
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  startTracking() {
    if (this.isTracking) return;
    
    this.isTracking = true;
    this.trackPageView();
    this.setupEventListeners();
    this.setupVisibilityChange();
    this.setupBeforeUnload();
  }

  trackPageView() {
    const pageData = {
      pageUrl: window.location.href,
      pageTitle: document.title,
      sessionId: this.sessionId,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language || navigator.userLanguage,
      utmSource: this.getUrlParameter('utm_source'),
      utmMedium: this.getUrlParameter('utm_medium'),
      utmCampaign: this.getUrlParameter('utm_campaign'),
      utmTerm: this.getUrlParameter('utm_term'),
      utmContent: this.getUrlParameter('utm_content')
    };

    this.sendTrackingData(pageData);
  }

  setupEventListeners() {
    // Tracker les clics sur les liens
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a');
      if (target) {
        this.trackEvent('link_click', {
          href: target.href,
          text: target.textContent.trim(),
          target: target.target
        });
      }
    });

    // Tracker les soumissions de formulaires
    document.addEventListener('submit', (e) => {
      this.trackEvent('form_submit', {
        formId: e.target.id || 'unknown',
        formAction: e.target.action
      });
    });

    // Tracker les scrolls
    let scrollTimeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        this.trackEvent('scroll', { scrollPercent });
      }, 1000);
    });

    // Tracker les interactions avec les boutons
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
        this.trackEvent('button_click', {
          buttonText: button.textContent.trim(),
          buttonId: button.id || 'unknown',
          buttonClass: button.className
        });
      }
    });
  }

  setupVisibilityChange() {
    let hidden, visibilityChange;
    
    if (typeof document.hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    document.addEventListener(visibilityChange, () => {
      if (document[hidden]) {
        this.trackEvent('page_hide', { duration: Date.now() - this.startTime });
      } else {
        this.trackEvent('page_show');
        this.startTime = Date.now();
      }
    });
  }

  setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      const duration = Date.now() - this.startTime;
      this.trackEvent('page_exit', { duration });
      
      // Envoyer les données de session
      this.sendSessionData(duration);
    });
  }

  trackEvent(eventType, eventData = {}) {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      sessionId: this.sessionId,
      ...eventData
    };

    // Stocker l'événement localement
    this.pageViews.push(event);
    
    // Envoyer les événements importants immédiatement
    if (['form_submit', 'link_click'].includes(eventType)) {
      this.sendEventData(event);
    }
  }

  async sendTrackingData(data) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.warn('Erreur tracking:', response.status);
      }
    } catch (error) {
      console.warn('Erreur envoi tracking:', error);
    }
  }

  async sendEventData(event) {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        console.warn('Erreur envoi événement:', response.status);
      }
    } catch (error) {
      console.warn('Erreur envoi événement:', error);
    }
  }

  async sendSessionData(duration) {
    try {
      const sessionData = {
        sessionId: this.sessionId,
        duration: duration,
        pageViews: this.pageViews.length,
        events: this.pageViews
      };

      // Utiliser sendBeacon pour les données de fin de session
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/sessions', JSON.stringify(sessionData));
      } else {
        // Fallback pour les navigateurs plus anciens
        fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData),
          keepalive: true
        });
      }
    } catch (error) {
      console.warn('Erreur envoi session:', error);
    }
  }

  getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Méthodes utilitaires
  getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const mobile = /Mobile|Android|iPhone|iPad|Windows Phone/i;
    const tablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i;
    
    let deviceType = 'desktop';
    if (tablet.test(userAgent)) deviceType = 'tablet';
    else if (mobile.test(userAgent)) deviceType = 'mobile';

    return {
      deviceType,
      userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }
}

// Initialiser le tracker quand le script est chargé
if (typeof window !== 'undefined') {
  window.visitorTracker = new VisitorTracker();
  
  // Exposer des méthodes globales pour le debugging
  window.trackEvent = (eventType, data) => {
    if (window.visitorTracker) {
      window.visitorTracker.trackEvent(eventType, data);
    }
  };
}

// Export pour les modules ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VisitorTracker;
} 