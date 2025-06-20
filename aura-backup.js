// Aura Backup System - Système de secours
class AuraBackup {
    constructor() {
        this.fallbackActive = false;
        this.backupEffect = null;
        this.init();
    }

    init() {
        // Créer l'effet de fallback
        this.createFallbackEffect();
        
        // Surveiller les changements d'état d'Aura
        this.monitorAuraStatus();
    }

    createFallbackEffect() {
        // Créer un canvas pour l'effet de fallback
        const canvas = document.createElement('canvas');
        canvas.id = 'aura-fallback-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: linear-gradient(45deg, #0a0a0a, #1a1a1a);
        `;

        // Ajouter au DOM
        document.body.appendChild(canvas);

        // Initialiser l'effet de particules
        this.initParticleEffect(canvas);
    }

    initParticleEffect(canvas) {
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 100;

        // Ajuster la taille du canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Classe Particule
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 3 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Rebondir sur les bords
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Garder dans les limites
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Créer les particules
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Fonction d'animation
        const animate = () => {
            if (!this.fallbackActive) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Dessiner le gradient de fond
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#0a0a0a');
            gradient.addColorStop(1, '#1a1a1a');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Mettre à jour et dessiner les particules
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Dessiner les connexions entre particules proches
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.save();
                        ctx.globalAlpha = (100 - distance) / 100 * 0.3;
                        ctx.strokeStyle = '#4a90e2';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                        ctx.restore();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        this.backupEffect = animate;
    }

    monitorAuraStatus() {
        // Vérifier toutes les 5 secondes si Aura fonctionne
        setInterval(() => {
            const auraIframe = document.querySelector('iframe[src*="aurachat.io"]');
            
            if (!auraIframe) {
                this.activateFallback('Iframe Aura manquante');
                return;
            }

            // Vérifier si l'iframe est visible et fonctionnelle
            const rect = auraIframe.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0;
            const hasContent = auraIframe.contentDocument || auraIframe.contentWindow;

            if (!isVisible || !hasContent) {
                this.activateFallback('Iframe Aura non fonctionnelle');
            } else {
                this.deactivateFallback();
            }
        }, 5000);
    }

    activateFallback(reason) {
        if (this.fallbackActive) return;

        console.log(`[Aura Backup] Activation du fallback: ${reason}`);
        this.fallbackActive = true;

        // Masquer l'iframe Aura
        const auraIframe = document.querySelector('iframe[src*="aurachat.io"]');
        if (auraIframe) {
            auraIframe.style.display = 'none';
        }

        // Afficher le canvas de fallback
        const fallbackCanvas = document.getElementById('aura-fallback-canvas');
        if (fallbackCanvas) {
            fallbackCanvas.style.display = 'block';
            this.backupEffect();
        }

        // Notifier l'utilisateur (optionnel)
        this.showNotification('Mode de secours activé - Effet de particules en cours');
    }

    deactivateFallback() {
        if (!this.fallbackActive) return;

        console.log('[Aura Backup] Désactivation du fallback - Aura fonctionne');
        this.fallbackActive = false;

        // Afficher l'iframe Aura
        const auraIframe = document.querySelector('iframe[src*="aurachat.io"]');
        if (auraIframe) {
            auraIframe.style.display = 'block';
        }

        // Masquer le canvas de fallback
        const fallbackCanvas = document.getElementById('aura-fallback-canvas');
        if (fallbackCanvas) {
            fallbackCanvas.style.display = 'none';
        }
    }

    showNotification(message) {
        // Créer une notification discrète
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animer l'apparition
        setTimeout(() => notification.style.opacity = '1', 100);
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Méthode pour forcer l'activation du fallback (pour test)
    forceFallback() {
        this.activateFallback('Test manuel');
    }

    // Méthode pour obtenir l'état du système
    getStatus() {
        return {
            fallbackActive: this.fallbackActive,
            auraIframePresent: !!document.querySelector('iframe[src*="aurachat.io"]'),
            fallbackCanvasPresent: !!document.getElementById('aura-fallback-canvas')
        };
    }
}

// Initialiser le système de backup
document.addEventListener('DOMContentLoaded', () => {
    window.auraBackup = new AuraBackup();
});

// Exposer pour debug
window.AuraBackup = AuraBackup; 