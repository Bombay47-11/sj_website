/**
 * Segeljungs - Nur im Kino
 * Main JavaScript file
 * Handles: Mobile menu toggle, sticky header, smooth scroll
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    /**
     * Toggle mobile navigation menu
     */
    function toggleMobileMenu() {
        mainNav.classList.toggle('header__nav--open');
        
        // Update aria-label for accessibility
        const isOpen = mainNav.classList.contains('header__nav--open');
        menuToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
        menuToggle.setAttribute('aria-expanded', isOpen);
    }

    /**
     * Close mobile menu when clicking outside
     */
    function handleOutsideClick(event) {
        if (mainNav.classList.contains('header__nav--open')) {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                mainNav.classList.remove('header__nav--open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    }

    /**
     * Handle sticky header on scroll
     */
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    /**
     * Smooth scroll to anchor links
     */
    function handleAnchorClick(event) {
        const target = event.target.closest('a[href^="#"]');
        
        if (target) {
            const targetId = target.getAttribute('href');
            
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    event.preventDefault();
                    
                    // Close mobile menu if open
                    mainNav.classList.remove('header__nav--open');
                    
                    // Scroll to target with offset for fixed header
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }

    /**
     * Initialize event listeners
     */
    function init() {
        // Mobile menu toggle
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close menu on outside click
        document.addEventListener('click', handleOutsideClick);

        // Sticky header on scroll
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Smooth scroll for anchor links
        document.addEventListener('click', handleAnchorClick);

        // Check initial scroll position
        handleScroll();

        // Close mobile menu on window resize (if switching to desktop)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mainNav.classList.contains('header__nav--open')) {
                mainNav.classList.remove('header__nav--open');
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
