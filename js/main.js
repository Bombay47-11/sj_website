/**
 * SEGELJUNGS - NUR IM KINO
 * Main JavaScript - Cinematic Edition
 * 
 * Features:
 * - Scroll reveal animations (IntersectionObserver) - bidirectional
 * - Parallax effects
 * - Header scroll behavior
 * - Mobile menu toggle
 * - Gallery filmstrip with lightbox
 * - Smooth scrolling for anchor links
 */

(function () {
    'use strict';

    // ============================================
    // DOM READY
    // ============================================
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initScrollReveal();
        initParallax();
        initHeader();
        initMobileMenu();
        initFilmstripLightbox();
        initGalleryNav();
        initSmoothScroll();
    }

    // ============================================
    // SCROLL REVEAL ANIMATIONS (Bidirectional)
    // ============================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');

        if (!revealElements.length) return;

        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements immediately
            revealElements.forEach(el => el.classList.add('visible'));
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Bidirectional: add/remove visible class based on intersection
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    // Only remove if scrolled above (for scroll-back effect)
                    const rect = entry.boundingClientRect;
                    if (rect.top > 0) {
                        entry.target.classList.remove('visible');
                    }
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    }

    // ============================================
    // PARALLAX EFFECTS
    // ============================================
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (!parallaxElements.length) return;

        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.3;
                const rect = el.getBoundingClientRect();
                const elementTop = rect.top + scrollY;

                // Only apply parallax when element is in or near viewport
                if (scrollY < elementTop + rect.height + 200) {
                    const yPos = (scrollY - elementTop) * speed;
                    el.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            });

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });

        // Initial call
        updateParallax();
    }

    // ============================================
    // HEADER SCROLL BEHAVIOR
    // ============================================
    function initHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;

            // Add scrolled class when user scrolls down
            if (scrollY > 50) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateHeader();
    }

    // ============================================
    // MOBILE MENU
    // ============================================
    function initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const menuLinks = document.querySelectorAll('.mobile-menu__link');

        if (!menuToggle || !mobileMenu) return;

        function toggleMenu() {
            const isActive = mobileMenu.classList.contains('active');

            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? '' : 'hidden';
        }

        function closeMenu() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        menuToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // ============================================
    // GALLERY LIGHTBOX
    // ============================================
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = lightbox?.querySelector('.lightbox__img');
        const lightboxClose = lightbox?.querySelector('.lightbox__close');
        const lightboxPrev = lightbox?.querySelector('.lightbox__prev');
        const lightboxNext = lightbox?.querySelector('.lightbox__next');
        const galleryItems = document.querySelectorAll('.gallery__item');

        if (!lightbox || !galleryItems.length) return;

        let currentIndex = 0;
        const images = Array.from(galleryItems).map(item => {
            const img = item.querySelector('.gallery__img');
            return {
                src: img?.src || '',
                alt: img?.alt || ''
            };
        });

        function openLightbox(index) {
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function updateLightboxImage() {
            if (lightboxImg && images[currentIndex]) {
                lightboxImg.src = images[currentIndex].src;
                lightboxImg.alt = images[currentIndex].alt;
            }
        }

        function showPrevImage() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightboxImage();
        }

        function showNextImage() {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightboxImage();
        }

        // Event listeners
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));

            // Keyboard accessibility
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', showPrevImage);
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', showNextImage);
        }

        // Click outside to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox__content')) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchEndX - touchStartX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    showPrevImage();
                } else {
                    showNextImage();
                }
            }
        }
    }

    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Skip if it's just "#" or empty
                if (!href || href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // OPTIONAL: Parallax effect for hero (subtle)
    // ============================================
    function initParallax() {
        const hero = document.querySelector('.hero');
        const heroImage = document.querySelector('.hero__bg-image');
        const heroCharacters = document.querySelector('.hero__characters');

        if (!hero || !heroImage) return;

        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrollY < heroHeight) {
                const parallaxValue = scrollY * 0.3;
                heroImage.style.transform = `translateY(${parallaxValue}px) scale(1.1)`;

                if (heroCharacters) {
                    heroCharacters.style.transform = `translateY(${scrollY * 0.1}px)`;
                }
            }

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // Uncomment to enable parallax
    // document.addEventListener('DOMContentLoaded', initParallax);

    // ============================================
    // GALLERY NAVIGATION
    // ============================================
    function initGalleryNav() {
        const filmstrip = document.getElementById('filmstrip');
        const prevBtn = document.querySelector('.gallery__nav-btn--prev');
        const nextBtn = document.querySelector('.gallery__nav-btn--next');

        if (!filmstrip || !prevBtn || !nextBtn) return;

        function updateButtons() {
            const scrollLeft = filmstrip.scrollLeft;
            const maxScroll = filmstrip.scrollWidth - filmstrip.clientWidth;

            // Allow some tolerance (1px)
            prevBtn.disabled = scrollLeft <= 1;
            nextBtn.disabled = scrollLeft >= maxScroll - 1;
        }

        function scrollGallery(direction) {
            const firstItem = filmstrip.querySelector('.gallery__frame');
            if (!firstItem) return;

            const itemWidth = firstItem.offsetWidth;
            // Get gap from computed style
            const style = window.getComputedStyle(filmstrip);
            const gap = parseFloat(style.gap) || 32; // Default 2rem if not found

            const scrollAmount = itemWidth + gap;

            filmstrip.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth'
            });
        }

        prevBtn.addEventListener('click', () => scrollGallery(-1));
        nextBtn.addEventListener('click', () => scrollGallery(1));

        filmstrip.addEventListener('scroll', () => {
            // Debounce or throttle could be good, but direct update is responsive
            updateButtons();
        }, { passive: true });

        window.addEventListener('resize', updateButtons);

        // Initial check
        // Wait a tick for layout
        setTimeout(updateButtons, 100);
    }

})();
