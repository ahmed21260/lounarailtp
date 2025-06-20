import createGlobe from 'https://cdn.skypack.dev/cobe';
import * as THREE from 'https://cdn.skypack.dev/three';

// Variables globales
let phi = 0;
let globe;
let particleSystem;
let scene, camera, renderer;
let particles = [];
const PARTICLE_COUNT = 2000;

// Initialisation du globe COBE
export async function initGlobe() {
    const canvas = document.getElementById('globe');
    const devicePixelRatio = window.devicePixelRatio || 1;
    const width = window.innerWidth * devicePixelRatio;
    const height = window.innerHeight * devicePixelRatio;
    
    canvas.width = width;
    canvas.height = height;

    globe = createGlobe(canvas, {
        devicePixelRatio,
        width,
        height,
        phi: 0,
        theta: 0.3,
        dark: 1,
        diffuse: 1.2,
        scale: 1,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [1, 1, 1],
        markerColor: [1, 0.5, 1],
        glowColor: [1, 1, 1],
        markers: [],
        onRender: (state) => {
            state.phi = phi;
            phi += 0.005;
        }
    });

    // Initialiser Three.js pour les particules
    initParticleSystem();

    // Gestion du redimensionnement
    window.addEventListener('resize', () => {
        const width = window.innerWidth * devicePixelRatio;
        const height = window.innerHeight * devicePixelRatio;
        canvas.width = width;
        canvas.height = height;
        globe.resize(width, height);

        // Mettre à jour Three.js
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialisation du système de particules Three.js
function initParticleSystem() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '20';
    document.body.appendChild(renderer.domElement);

    // Créer les particules
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = [];
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Position initiale sur une sphère
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const radius = 2;

        positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
        positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = radius * Math.cos(theta);

        // Vélocité pour l'explosion
        velocities.push({
            x: (Math.random() - 0.5) * 0.2,
            y: (Math.random() - 0.5) * 0.2,
            z: (Math.random() - 0.5) * 0.2
        });
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xfbbf24,
        size: 0.05,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    
    camera.position.z = 5;
    
    // Cacher initialement les particules
    particleSystem.visible = false;
    
    // Stocker les données pour l'animation
    particles = {
        positions: positions,
        velocities: velocities,
        opacity: 1
    };
}

// Animation des particules
function animateParticles() {
    const positions = particleSystem.geometry.attributes.position.array;
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] += particles.velocities[i].x;
        positions[i * 3 + 1] += particles.velocities[i].y;
        positions[i * 3 + 2] += particles.velocities[i].z;

        // Ajouter un effet de gravité/dispersion
        particles.velocities[i].y -= 0.001;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
    
    // Faire disparaître progressivement les particules
    particles.opacity -= 0.005;
    particleSystem.material.opacity = particles.opacity;

    if (particles.opacity > 0) {
        renderer.render(scene, camera);
        requestAnimationFrame(animateParticles);
    } else {
        // Transition vers la page principale
        const leftSplit = document.querySelector('.split.left');
        const rightSplit = document.querySelector('.split.right');
        
        leftSplit.classList.add('active');
        rightSplit.classList.add('active');
        
        setTimeout(() => {
            window.location.href = 'lounarailtp.html';
        }, 1000);
    }
}

// Animation de la barre de loading
export function animateLoading() {
    const progress = document.querySelector('.loading-progress');
    const text = document.querySelector('.loading-text');
    const loadingContainer = document.getElementById('loading-container');
    const discoverButton = document.getElementById('discover-button');
    const globeContainer = document.getElementById('globe-container');
    
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingContainer.style.display = 'none';
                discoverButton.style.display = 'block';
                
                // Démarrer l'explosion automatiquement
                startExplosionEffect();
            }, 500);
        } else {
            width += 1;
            progress.style.width = width + '%';
            text.textContent = width + '%';
        }
    }, 30);
}

// Démarrer l'effet d'explosion
function startExplosionEffect() {
    const globeContainer = document.getElementById('globe-container');
    const discoverButton = document.getElementById('discover-button');
    
    // Faire disparaître le globe et le bouton
    globeContainer.classList.add('fade-out');
    discoverButton.style.display = 'none';
    
    // Afficher et animer les particules
    setTimeout(() => {
        particleSystem.visible = true;
        animateParticles();
    }, 700);
}

// Gestion de la transition
export function handleTransition() {
    const discoverButton = document.getElementById('discover-button');
    
    discoverButton.addEventListener('click', () => {
        startExplosionEffect();
    });
} 