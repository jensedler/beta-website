/**
 * OIC Bielefeld - Main JavaScript
 * Handles animations, scroll effects, and interactions
 */

(function() {
    'use strict';

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('hero');
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initAdaptiveNavigation();
        initNavbar();
        initScrollAnimations();
        initSmoothScrolling();
        initParallaxEffects();
        initTeamCardAnimations();
        initProjectCardAnimations();
        initLogoErrorHandling();
    });

    /**
     * Adaptive Navigation System
     */
    class AdaptiveNavigation {
        constructor() {
            this.navbar = document.getElementById('navbar');
            this.currentTheme = 'dark';
            this.init();
        }

        init() {
            this.setupBackgroundDetection();
            this.setupMobileMenu();
        }

        setupBackgroundDetection() {
            const sections = document.querySelectorAll('section');
            const options = {
                root: null,
                rootMargin: '-10% 0% -80% 0%',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.detectSectionTheme(entry.target);
                    }
                });
            }, options);

            sections.forEach(section => observer.observe(section));
        }

        detectSectionTheme(section) {
            const sectionId = section.id;
            const computedStyle = window.getComputedStyle(section);
            const backgroundColor = computedStyle.backgroundColor;
            
            let isLight = false;
            
            if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
                isLight = this.isLightColor(backgroundColor);
            } else {
                // Fallback: check section classes or data attributes
                isLight = section.classList.contains('light-section') || 
                         section.classList.contains('about') ||
                         section.classList.contains('projects') ||
                         section.classList.contains('events') ||
                         section.dataset.theme === 'light' ||
                         sectionId === 'about' || 
                         sectionId === 'team' ||
                         sectionId === 'projects' ||
                         sectionId === 'events';
            }
            
            const newTheme = isLight ? 'light' : 'dark';
            this.switchTheme(newTheme);
        }

        isLightColor(color) {
            const rgb = this.parseRGBColor(color);
            if (!rgb) return false;
            
            const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
            return luminance > 0.5;
        }

        parseRGBColor(color) {
            const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (rgbMatch) {
                return {
                    r: parseInt(rgbMatch[1]),
                    g: parseInt(rgbMatch[2]),
                    b: parseInt(rgbMatch[3])
                };
            }
            
            if (color.startsWith('#')) {
                const hex = color.replace('#', '');
                return {
                    r: parseInt(hex.substr(0, 2), 16),
                    g: parseInt(hex.substr(2, 2), 16),
                    b: parseInt(hex.substr(4, 2), 16)
                };
            }
            
            return null;
        }

        switchTheme(newTheme) {
            if (this.currentTheme !== newTheme) {
                this.currentTheme = newTheme;
                this.navbar.classList.remove('light-theme', 'dark-theme');
                this.navbar.classList.add(`${newTheme}-theme`);
            }
        }

        setupMobileMenu() {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');
            
            if (!mobileMenuBtn || !navLinks) return;
            
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
                mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
                mobileMenuBtn.setAttribute('aria-label', 
                    navLinks.classList.contains('active') ? 'Menü schließen' : 'Menü öffnen'
                );
            });
            
            navLinks.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuBtn.textContent = '☰';
                    mobileMenuBtn.setAttribute('aria-label', 'Menü öffnen');
                }
            });
            
            document.addEventListener('click', (e) => {
                if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuBtn.textContent = '☰';
                    mobileMenuBtn.setAttribute('aria-label', 'Menü öffnen');
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuBtn.textContent = '☰';
                    mobileMenuBtn.setAttribute('aria-label', 'Menü öffnen');
                }
            });
        }
    }

    /**
     * Initialize Adaptive Navigation
     */
    function initAdaptiveNavigation() {
        new AdaptiveNavigation();
    }

    /**
     * Logo Error Handling
     */
    let logoErrorCount = 0;
    
    function handleLogoError(logoElement) {
        logoElement.style.display = 'none';
        logoErrorCount++;
        
        // Only show fallback if both logos fail to load
        if (logoErrorCount >= 2) {
            const logoFallback = document.getElementById('logoFallback');
            if (logoFallback) {
                logoFallback.classList.add('show');
            }
        }
    }

    function initLogoErrorHandling() {
        const logoImages = document.querySelectorAll('.logo img');
        logoImages.forEach(img => {
            img.addEventListener('error', () => handleLogoError(img));
        });
    }

    /**
     * Navbar scroll effects
     */
    function initNavbar() {
        let isScrolled = false;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50 && !isScrolled) {
                navbar.classList.add('scrolled');
                isScrolled = true;
            } else if (scrollTop <= 50 && isScrolled) {
                navbar.classList.remove('scrolled');
                isScrolled = false;
            }
        });
    }

    /**
     * Intersection Observer for scroll animations
     */
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add staggered animation for team cards
                    if (entry.target.classList.contains('team-card')) {
                        const delay = entry.target.dataset.delay || 0;
                        entry.target.style.transitionDelay = delay + 's';
                        
                        // Reset transition delay after animation completes
                        setTimeout(function() {
                            entry.target.style.transitionDelay = '0s';
                        }, (parseFloat(delay) + 0.4) * 1000); // 0.4s = transition duration
                    }
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll(
            '.fade-in, .principle-card, .team-card, .project-card, .contact-card, .event-card'
        );
        
        animatedElements.forEach(function(element, index) {
            // Add staggered delays for cards
            if (element.classList.contains('team-card') || 
                element.classList.contains('project-card') ||
                element.classList.contains('event-card')) {
                element.dataset.delay = (index * 0.1).toFixed(1);
            }
            
            observer.observe(element);
        });
    }

    /**
     * Smooth scrolling for navigation links
     */
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add scroll indicator functionality
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function() {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    /**
     * Enhanced parallax effects for hero section
     */
    function initParallaxEffects() {
        const heroBackground = document.querySelector('.hero-bg');
        const graffitiOverlay = document.querySelector('.graffiti-overlay');
        
        if (!heroBackground && !graffitiOverlay) return;
        
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const heroHeight = window.innerHeight;
            
            // Only apply parallax when hero section is visible
            if (scrolled < heroHeight) {
                if (heroBackground) {
                    const bgRate = scrolled * -0.5;
                    heroBackground.style.transform = `translateY(${bgRate}px)`;
                }
                
                if (graffitiOverlay) {
                    // Enhanced parallax for graffiti
                    const graffitiRate = scrolled * 0.3;
                    graffitiOverlay.style.transform = `translate(-50%, calc(-50% + ${graffitiRate}px))`;
                }
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        // Only add parallax if user hasn't requested reduced motion
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.addEventListener('scroll', requestTick);
        }
    }

    /**
     * Enhanced team card animations
     */
    function initTeamCardAnimations() {
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach(function(card, index) {
            // Add hover effects for expertise items
            const expertiseItems = card.querySelectorAll('.expertise-list li');
            
            expertiseItems.forEach(function(item) {
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateX(5px)';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateX(0)';
                });
            });
            
            // Add card flip effect on click (optional)
            card.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    /**
     * Project card interactions
     */
    function initProjectCardAnimations() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(function(card) {
            const tag = card.querySelector('.project-tag');
            
            card.addEventListener('mouseenter', function() {
                if (tag) {
                    tag.style.transform = 'scale(1.1) rotate(-2deg)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (tag) {
                    tag.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    /**
     * Utility function to debounce scroll events
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /**
     * Add loading animation for images
     */
    function initImageLoading() {
        const images = document.querySelectorAll('.team-image');
        
        images.forEach(function(img) {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            img.addEventListener('error', function() {
                // Fallback to placeholder if image fails to load
                const placeholder = this.nextElementSibling;
                if (placeholder && placeholder.classList.contains('team-placeholder')) {
                    this.style.display = 'none';
                    placeholder.style.display = 'flex';
                }
            });
        });
    }

    /**
     * Add subtle animations to contact cards
     */
    function initContactAnimations() {
        const contactCards = document.querySelectorAll('.contact-card');
        
        contactCards.forEach(function(card, index) {
            card.style.animationDelay = (index * 0.1) + 's';
            
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    /**
     * Enhanced event card animations
     */
    function initEventAnimations() {
        const eventCards = document.querySelectorAll('.event-card');
        
        eventCards.forEach(function(card, index) {
            // Staggered animation delay
            card.style.animationDelay = (index * 0.1) + 's';
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', function() {
                const bookBtn = this.querySelector('.event-book-btn');
                if (bookBtn) {
                    bookBtn.style.transform = 'translateY(-2px) scale(1.05)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const bookBtn = this.querySelector('.event-book-btn');
                if (bookBtn) {
                    bookBtn.style.transform = 'translateY(0) scale(1)';
                }
            });
            
            // Track clicks for analytics (optional)
            const bookBtn = card.querySelector('.event-book-btn');
            if (bookBtn) {
                bookBtn.addEventListener('click', function() {
                    // Add analytics tracking here if needed
                    console.log('Event booking clicked:', card.querySelector('.event-title').textContent);
                });
            }
        });
    }

    /**
     * Date formatting and validation for events
     */
    function initEventDateHandling() {
        const eventCards = document.querySelectorAll('.event-card');
        const today = new Date();
        
        eventCards.forEach(function(card) {
            const dateElement = card.querySelector('[data-date]');
            if (dateElement) {
                const eventDate = new Date(dateElement.dataset.date);
                
                // Add "heute" or "morgen" labels
                const diffTime = eventDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 0) {
                    dateElement.innerHTML += ' <span style="color: var(--secondary-pink); font-weight: 600;">(Heute!)</span>';
                } else if (diffDays === 1) {
                    dateElement.innerHTML += ' <span style="color: var(--secondary-green); font-weight: 600;">(Morgen)</span>';
                } else if (diffDays <= 7) {
                    dateElement.innerHTML += ` <span style="color: var(--primary-turquoise); font-weight: 600;">(in ${diffDays} Tagen)</span>`;
                }
            }
        });
    }

    /**
     * Initialize all contact and event animations when DOM is ready
     */
    document.addEventListener('DOMContentLoaded', function() {
        initImageLoading();
        initContactAnimations();
        initEventAnimations();
        initEventDateHandling();
    });

    /**
     * Add window resize handler for responsive adjustments
     */
    window.addEventListener('resize', debounce(function() {
        // Recalculate parallax effects on resize
        if (window.innerWidth <= 768) {
            // Disable parallax on mobile for performance
            const heroBackground = document.querySelector('.hero-bg');
            const graffitiOverlay = document.querySelector('.graffiti-overlay');
            if (heroBackground) {
                heroBackground.style.transform = '';
            }
            if (graffitiOverlay) {
                graffitiOverlay.style.transform = 'translate(-50%, -50%)';
            }
        }
    }, 250));

    /**
     * Add smooth transitions when page loads
     */
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger hero animations
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('animate');
        }
        
        // Handle graffiti image error
        const graffitiImg = document.querySelector('.graffiti-overlay');
        const graffitiFallback = document.querySelector('.graffiti-fallback');
        
        if (graffitiImg) {
            graffitiImg.addEventListener('error', function() {
                this.style.display = 'none';
                if (graffitiFallback) {
                    graffitiFallback.style.display = 'block';
                }
            });
        }
    });

    /**
     * Add keyboard navigation support
     */
    document.addEventListener('keydown', function(e) {
        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            const navLinks = document.querySelector('.nav-links');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '☰';
                }
            }
        }
    });

    /**
     * Global function for logo error handling (can be called from HTML)
     */
    window.handleLogoError = handleLogoError;

})();