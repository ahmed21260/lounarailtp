// COBE - Bibliothèque pour le globe interactif
var createGlobe = (function() {
    function create(canvas, options = {}) {
        const {
            width = 1000,
            height = 1000,
            devicePixelRatio = 1,
            phi = 0,
            theta = 0,
            dark = 0,
            diffuse = 1.2,
            mapSamples = 16000,
            mapBrightness = 6,
            baseColor = [1, 1, 1],
            markerColor = [1, 0.5, 1],
            glowColor = [1, 1, 1],
            markers = [],
            onRender = (state) => {}
        } = options;

        // Configuration du canvas
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // État du globe
        let rotation = phi;
        let tilt = theta;

        // Fonction de rendu
        function render() {
            // Effacer le canvas
            ctx.clearRect(0, 0, width, height);

            // Calculer le centre
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.4;

            // Dessiner le globe
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            
            // Appliquer le dégradé pour l'effet de globe
            const gradient = ctx.createRadialGradient(
                centerX + radius * 0.3, 
                centerY - radius * 0.3,
                0,
                centerX,
                centerY,
                radius
            );

            if (dark) {
                gradient.addColorStop(0, `rgba(${baseColor[0] * 255}, ${baseColor[1] * 255}, ${baseColor[2] * 255}, 0.8)`);
                gradient.addColorStop(1, `rgba(${baseColor[0] * 255 * 0.5}, ${baseColor[1] * 255 * 0.5}, ${baseColor[2] * 255 * 0.5}, 0.2)`);
            } else {
                gradient.addColorStop(0, `rgba(${baseColor[0] * 255}, ${baseColor[1] * 255}, ${baseColor[2] * 255}, 1)`);
                gradient.addColorStop(1, `rgba(${baseColor[0] * 255 * 0.8}, ${baseColor[1] * 255 * 0.8}, ${baseColor[2] * 255 * 0.8}, 0.6)`);
            }

            ctx.fillStyle = gradient;
            ctx.fill();

            // Effet de brillance
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 1.1, 0, Math.PI * 2);
            const glowGradient = ctx.createRadialGradient(
                centerX,
                centerY,
                radius,
                centerX,
                centerY,
                radius * 1.1
            );
            glowGradient.addColorStop(0, `rgba(${glowColor[0] * 255}, ${glowColor[1] * 255}, ${glowColor[2] * 255}, 0.3)`);
            glowGradient.addColorStop(1, `rgba(${glowColor[0] * 255}, ${glowColor[1] * 255}, ${glowColor[2] * 255}, 0)`);
            ctx.fillStyle = glowGradient;
            ctx.fill();

            // Dessiner les marqueurs
            markers.forEach(marker => {
                const x = centerX + radius * Math.cos(marker.lat) * Math.cos(marker.lng + rotation);
                const y = centerY + radius * Math.sin(marker.lat);
                
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${markerColor[0] * 255}, ${markerColor[1] * 255}, ${markerColor[2] * 255}, 0.8)`;
                ctx.fill();
            });

            // Mettre à jour l'état et appeler le callback
            const state = { phi: rotation, theta: tilt };
            onRender(state);
            rotation = state.phi;
            tilt = state.theta;

            // Animation
            requestAnimationFrame(render);
        }

        // Démarrer l'animation
        render();

        // Retourner l'API
        return {
            resize(w, h) {
                canvas.width = w;
                canvas.height = h;
            },
            destroy() {
                // Cleanup si nécessaire
            }
        };
    }

    return create;
})();

// Exporter la fonction
window.createGlobe = createGlobe; 