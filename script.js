// Script pour ajuster le défilement en tenant compte du menu fixe
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les liens qui commencent par #
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Empêcher le comportement par défaut
            e.preventDefault();
            
            // Obtenir l'ID de la cible
            const targetId = this.getAttribute('href');
            
            // Si c'est juste #, défiler vers le haut
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            // Trouver l'élément cible
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Obtenir la hauteur du menu
                const menuHeight = document.querySelector('.menu').offsetHeight;
                
                // Calculer la position de défilement
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - menuHeight;
                
                // Défiler vers la cible
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Défilement fluide pour l'indicateur de défilement et les liens d'ancrage
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du défilement fluide pour tous les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60, // Ajustement pour le menu fixe
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation spécifique pour l'indicateur de défilement
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const competenceSection = document.querySelector('#competences');
            if (competenceSection) {
                window.scrollTo({
                    top: competenceSection.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    }
});