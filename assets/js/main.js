// main.js
document.addEventListener('DOMContentLoaded', function() {

    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenu && navLinks) {
        const closeMobileMenu = () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        };

        mobileMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        document.addEventListener('click', (event) => {
            const target = event.target;
            if (!navLinks.contains(target) && !mobileMenu.contains(target) && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Close menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            if (backToTop) {
                if (window.scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }
        });
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer para animación scroll-fade-up
    const scrollElements = document.querySelectorAll('.scroll-fade-up');
    if (scrollElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        scrollElements.forEach(el => observer.observe(el));
    } else if (scrollElements.length > 0) {
        // Fallback: mostrar elementos sin animación si no hay soporte
        scrollElements.forEach(el => el.classList.add('is-visible'));
    }
});

function initTreatmentsCarousel() {
    const track = document.querySelector('.treatments-carousel');
    const carouselWrapper = document.querySelector('.treatments-carousel-wrapper');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    if (!track || !prevBtn || !nextBtn) return;

    const slides = Array.from(track.children);
    if (!slides.length) return;

    const gap = parseFloat(getComputedStyle(track).gap || '0');
    const scrollDistance = slides[0].getBoundingClientRect().width + gap;
    let autoTimer = null;

    const scrollToIndex = (direction = 1) => {
        track.scrollBy({ left: direction * scrollDistance, behavior: 'smooth' });
    };

    prevBtn.addEventListener('click', () => {
        scrollToIndex(-1);
        resetAuto();
    });

    nextBtn.addEventListener('click', () => {
        scrollToIndex(1);
        resetAuto();
    });

    const resetAuto = () => {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(() => scrollToIndex(1), 5000);
    };

    track.addEventListener('mouseenter', () => {
        if (autoTimer) clearInterval(autoTimer);
    });

    track.addEventListener('mouseleave', resetAuto);
    carouselWrapper.addEventListener('focusin', () => {
        if (autoTimer) clearInterval(autoTimer);
    });
    carouselWrapper.addEventListener('focusout', resetAuto);

    resetAuto();
}

document.addEventListener('DOMContentLoaded', initTreatmentsCarousel);

// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const modalOverlay = document.getElementById('treatment-modal');
    if (!modalOverlay) return;

    const modalTitle = modalOverlay.querySelector('#modal-title');
    const modalDescription = modalOverlay.querySelector('.modal-description');
    const whatsappModal = modalOverlay.querySelector('.whatsapp-modal');
    const closeButton = modalOverlay.querySelector('.modal-close');
    const dismissButtons = modalOverlay.querySelectorAll('.modal-dismiss');
    let activeCell = null;

    const openModal = (card) => {
        const title = card.querySelector('h3')?.textContent.trim() || 'Tratamiento';
        const description = card.dataset.description || 'Solicitá más información personalizada.';
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        const message = encodeURIComponent(`Hola Dra. Micaela, me interesa ${title}.`);
        whatsappModal.href = `https://wa.me/543416427796?text=${message}`;
        modalOverlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        if (activeCell) activeCell.classList.remove('active');
        activeCell = card;
        card.classList.add('active');
    };

    const closeModal = () => {
        modalOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
        if (activeCell) {
            activeCell.classList.remove('active');
            activeCell = null;
        }
    };

    const heroChatOffset = document.documentElement.style;
    const chatDown = document.getElementById('chat-down');
    const chatUp = document.getElementById('chat-up');

    const offsetValue = () => parseFloat(getComputedStyle(document.documentElement)
        .getPropertyValue('--hero-chat-offset')) || 0;

    const changeOffset = (delta) => {
        let next = parseFloat((offsetValue() + delta).toFixed(2));
        next = Math.min(3.5, Math.max(-1, next));
        heroChatOffset.setProperty('--hero-chat-offset', `${next}rem`);
    };

    if (chatDown && chatUp) {
        chatDown.addEventListener('click', () => changeOffset(0.25));
        chatUp.addEventListener('click', () => changeOffset(-0.25));
    }

    document.querySelectorAll('.treatment-cell').forEach(card => {
        card.addEventListener('click', () => {
            if (activeCell) {
                activeCell.classList.remove('active');
                activeCell = null;
            }
            openModal(card);
        });
    });

    document.querySelectorAll('.treatment-view-more').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const card = button.closest('.treatment-cell');
            if (card) openModal(card);
        });
    });

    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    closeButton?.addEventListener('click', closeModal);
    dismissButtons.forEach(btn => btn.addEventListener('click', closeModal));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
            closeModal();
        }
    });
});