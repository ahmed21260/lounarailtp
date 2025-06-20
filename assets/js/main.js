// Gestion des animations au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Ajouter les bulles dynamiquement
    createBubbles();
    
    // Animer les éléments avec fade-in
    animateFadeElements();
    
    // Gérer les accordéons
    setupAccordions();
});

// Création des bulles d'animation
function createBubbles() {
    const container = document.querySelector('.bubbles-container');
    const bubbleCount = 15;
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // Taille aléatoire
        const size = Math.random() * 100 + 50;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Position aléatoire
        bubble.style.left = `${Math.random() * 100}%`;
        
        // Délai et durée aléatoires
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        bubble.style.animation = `float ${duration}s ${delay}s infinite linear`;
        
        container.appendChild(bubble);
    }
}

// Animation des éléments fade-in
function animateFadeElements() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
    });
}

// Configuration des accordéons
function setupAccordions() {
    const accordions = document.querySelectorAll('.accordion-group');
    
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        const content = accordion.querySelector('.accordion-content');
        const icon = accordion.querySelector('.accordion-icon');
        
        header.addEventListener('click', () => {
            const isActive = content.classList.contains('active');
            
            // Fermer tous les accordéons
            document.querySelectorAll('.accordion-content').forEach(c => {
                c.classList.remove('active');
                c.style.maxHeight = '0';
            });
            
            document.querySelectorAll('.accordion-icon').forEach(i => {
                i.style.transform = 'rotate(0deg)';
            });
            
            // Ouvrir/fermer l'accordéon cliqué
            if (!isActive) {
                content.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// Affichage des notifications toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
        toast.remove();
    }, 3000);
} 