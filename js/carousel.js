/**
 * Carousel Component
 * Un carrousel d'images réutilisable pour le portfolio avec lightbox
 */
class Carousel {
    /**
     * Initialise un nouveau carrousel
     * @param {string} containerId - ID du conteneur HTML où le carrousel sera injecté
     * @param {Array} images - Tableau d'objets images avec src et alt
     * @param {Object} options - Options du carrousel (autoplay, delay, etc.)
     */
    constructor(containerId, images, options = {}) {
        this.containerId = containerId;
        this.images = images;
        this.currentIndex = 0;
        this.lightboxIndex = 0;
        this.options = {
            autoplay: options.autoplay || false,
            delay: options.delay || 5000,
            showIndicators: options.showIndicators !== undefined ? options.showIndicators : true,
            showControls: options.showControls !== undefined ? options.showControls : true,
            height: options.height || '400px',
            caption: options.caption || ''
        };
        
        this.autoplayInterval = null;
        this.lightboxActive = false;
        this.init();
        this.initLightbox();
    }
    
    /**
     * Initialise le carrousel
     */
    init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Conteneur avec l'ID ${this.containerId} non trouvé`);
            return;
        }
        
        // Vider le conteneur
        container.innerHTML = '';
        
        // Créer la structure du carrousel
        container.classList.add('carousel-container');
        container.style.height = this.options.height;
        
        // Créer le conteneur des slides
        const slidesContainer = document.createElement('div');
        slidesContainer.className = 'carousel-slides';
        container.appendChild(slidesContainer);
        
        // Ajouter les images
        this.images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            if (index === 0) {
                slide.classList.add('active');
            }
            
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt || `Image ${index + 1}`;
            
            // Ajouter un événement de clic pour ouvrir le lightbox
            img.addEventListener('click', () => {
                this.openLightbox(index);
            });
            
            slide.appendChild(img);
            slidesContainer.appendChild(slide);
        });
        
        // Ajouter les contrôles si nécessaire
        if (this.options.showControls && this.images.length > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-control prev';
            prevBtn.innerHTML = '&#10094;';
            prevBtn.addEventListener('click', () => this.prevSlide());
            container.appendChild(prevBtn);
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-control next';
            nextBtn.innerHTML = '&#10095;';
            nextBtn.addEventListener('click', () => this.nextSlide());
            container.appendChild(nextBtn);
        }
        
        // Ajouter les indicateurs si nécessaire
        if (this.options.showIndicators && this.images.length > 1) {
            const indicators = document.createElement('div');
            indicators.className = 'carousel-indicators';
            
            this.images.forEach((_, index) => {
                const indicator = document.createElement('span');
                indicator.className = 'carousel-indicator';
                if (index === 0) {
                    indicator.classList.add('active');
                }
                indicator.addEventListener('click', () => this.goToSlide(index));
                indicators.appendChild(indicator);
            });
            
            container.appendChild(indicators);
        }
        
        // Démarrer l'autoplay si nécessaire
        if (this.options.autoplay && this.images.length > 1) {
            this.startAutoplay();
        }
        
        // Ajouter une légende si elle existe
        if (this.options.caption) {
            const caption = document.createElement('div');
            caption.className = 'carousel-caption';
            caption.textContent = this.options.caption;
            container.appendChild(caption);
        }
    }
    
    /**
     * Passe à la slide suivante
     */
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateSlides();
    }
    
    /**
     * Passe à la slide précédente
     */
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateSlides();
    }
    
    /**
     * Va à une slide spécifique
     * @param {number} index - Index de la slide
     */
    goToSlide(index) {
        if (index >= 0 && index < this.images.length) {
            this.currentIndex = index;
            this.updateSlides();
        }
    }
    
    /**
     * Met à jour l'affichage des slides
     */
    updateSlides() {
        const container = document.getElementById(this.containerId);
        
        // Mettre à jour les slides
        const slides = container.querySelectorAll('.carousel-slide');
        slides.forEach((slide, index) => {
            if (index === this.currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Mettre à jour les indicateurs
        const indicators = container.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Réinitialiser l'autoplay si activé
        if (this.options.autoplay) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }
    
    /**
     * Démarre l'autoplay
     */
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.options.delay);
    }
    
    /**
     * Arrête l'autoplay
     */
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
    
    /**
     * Initialise le lightbox (popup)
     */
    initLightbox() {
        // Créer un ID unique pour ce lightbox basé sur l'ID du conteneur
        const lightboxId = `lightbox-${this.containerId}`;
        
        // Créer le lightbox s'il n'existe pas déjà
        if (!document.getElementById(lightboxId)) {
            const lightbox = document.createElement('div');
            lightbox.id = lightboxId;
            lightbox.className = 'lightbox-overlay';
            lightbox.dataset.carouselId = this.containerId; // Stocker l'ID du carrousel associé
            
            const container = document.createElement('div');
            container.className = 'lightbox-container';
            
            const img = document.createElement('img');
            img.className = 'lightbox-image';
            container.appendChild(img);
            
            const caption = document.createElement('div');
            caption.className = 'lightbox-caption';
            container.appendChild(caption);
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'lightbox-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => this.closeLightbox());
            container.appendChild(closeBtn);
            
            const prevBtn = document.createElement('button');
            prevBtn.className = 'lightbox-prev';
            prevBtn.innerHTML = '&#10094;';
            prevBtn.addEventListener('click', () => this.prevLightboxImage());
            container.appendChild(prevBtn);
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'lightbox-next';
            nextBtn.innerHTML = '&#10095;';
            nextBtn.addEventListener('click', () => this.nextLightboxImage());
            container.appendChild(nextBtn);
            
            lightbox.appendChild(container);
            document.body.appendChild(lightbox);
            
            // Fermer le lightbox en cliquant en dehors de l'image
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    this.closeLightbox();
                }
            });
        }
        
        // Ajouter les raccourcis clavier globaux (une seule fois)
        if (!window.carouselKeyboardListenerAdded) {
            document.addEventListener('keydown', (e) => {
                // Trouver le carrousel actif
                const activeCarousel = document.querySelector('.lightbox-overlay.active');
                if (!activeCarousel) return;
                
                // Trouver l'instance de carrousel associée
                const carouselId = activeCarousel.dataset.carouselId;
                const carouselInstance = window.carouselInstances[carouselId];
                if (!carouselInstance) return;
                
                switch (e.key) {
                    case 'Escape':
                        carouselInstance.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        carouselInstance.prevLightboxImage();
                        break;
                    case 'ArrowRight':
                        carouselInstance.nextLightboxImage();
                        break;
                }
            });
            window.carouselKeyboardListenerAdded = true;
        }
    }
    
    /**
     * Ouvre le lightbox avec l'image spécifiée
     * @param {number} index - Index de l'image à afficher
     */
    openLightbox(index) {
        if (this.options.autoplay) {
            this.stopAutoplay();
        }
        
        const lightboxId = `lightbox-${this.containerId}`;
        const lightbox = document.getElementById(lightboxId);
        const img = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');
        
        this.lightboxIndex = index;
        this.lightboxActive = true;
        
        img.src = this.images[index].src;
        caption.textContent = this.images[index].alt || this.options.caption;
        
        // Fermer tous les autres lightbox avant d'ouvrir celui-ci
        document.querySelectorAll('.lightbox-overlay.active').forEach(el => {
            el.classList.remove('active');
        });
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêcher le défilement de la page
    }
    
    /**
     * Ferme le lightbox
     */
    closeLightbox() {
        const lightboxId = `lightbox-${this.containerId}`;
        const lightbox = document.getElementById(lightboxId);
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Réactiver le défilement de la page
        
        this.lightboxActive = false;
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }
    
    /**
     * Affiche l'image précédente dans le lightbox
     */
    prevLightboxImage() {
        this.lightboxIndex = (this.lightboxIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }
    
    /**
     * Affiche l'image suivante dans le lightbox
     */
    nextLightboxImage() {
        this.lightboxIndex = (this.lightboxIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }
    
    /**
     * Met à jour l'image affichée dans le lightbox
     */
    updateLightboxImage() {
        const lightboxId = `lightbox-${this.containerId}`;
        const lightbox = document.getElementById(lightboxId);
        const img = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');
        
        img.src = this.images[this.lightboxIndex].src;
        caption.textContent = this.images[this.lightboxIndex].alt || this.options.caption;
    }
}

// Stocker les instances de carrousel pour y accéder depuis les événements globaux
if (!window.carouselInstances) {
    window.carouselInstances = {};
}

// Rendre la classe disponible globalement
window.Carousel = function(containerId, images, options) {
    const instance = new Carousel(containerId, images, options);
    window.carouselInstances[containerId] = instance;
    return instance;
};
