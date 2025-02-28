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

// Gestion du menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const hasSubmenuItems = document.querySelectorAll('.has-submenu');
    
    // Fonction pour fermer tous les sous-menus
    function closeAllSubmenus() {
        hasSubmenuItems.forEach(item => {
            item.classList.remove('active');
        });
    }
    
    // Gérer le clic sur le bouton hamburger
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Si le menu est fermé, fermer tous les sous-menus
            if (!navLinks.classList.contains('active')) {
                closeAllSubmenus();
            }
        });
    }
    
    // Gérer les clics sur les éléments avec sous-menus sur mobile
    hasSubmenuItems.forEach(item => {
        const link = item.querySelector('a');
        
        // Créer un gestionnaire d'événements pour les appareils mobiles
        const handleMobileSubmenu = function(e) {
            // Vérifier si nous sommes sur mobile (largeur d'écran <= 768px)
            if (window.innerWidth <= 768) {
                e.preventDefault();
                
                // Si l'élément cliqué est déjà actif, le désactiver
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                } else {
                    // Fermer tous les autres sous-menus au même niveau
                    const siblings = Array.from(item.parentElement.children);
                    siblings.forEach(sibling => {
                        if (sibling !== item && sibling.classList.contains('has-submenu')) {
                            sibling.classList.remove('active');
                        }
                    });
                    
                    // Activer le sous-menu actuel
                    item.classList.add('active');
                }
            }
        };
        
        // Ajouter l'écouteur d'événements
        link.addEventListener('click', handleMobileSubmenu);
    });
    
    // Fermer le menu mobile lorsqu'on clique sur un lien (qui n'a pas de sous-menu)
    const menuLinks = document.querySelectorAll('.nav-links li:not(.has-submenu) a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                closeAllSubmenus();
            }
        });
    });
    
    // Fermer le menu mobile lorsqu'on redimensionne la fenêtre à une taille plus grande
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            closeAllSubmenus();
        }
    });
});