// Enhanced Bitcoin Manifesto JavaScript with Mobile Optimizations

// DOM Elements
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const languageSwitcher = document.querySelector('.language-switcher');
const languageDropdown = document.querySelector('.language-dropdown');

// Mobile Navigation Toggle
function initMobileNavigation() {
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.classList.toggle('nav-open');
    
    // Update aria attributes
    const isOpen = navMenu.classList.contains('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    navMenu.setAttribute('aria-hidden', !isOpen);
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.classList.remove('nav-open');
    
    // Update aria attributes
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
}

// Enhanced Language Switcher
function initLanguageSwitcher() {
    if (languageSwitcher) {
        // Handle keyboard navigation
        languageSwitcher.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                languageSwitcher.classList.toggle('active');
            }
            
            if (e.key === 'Escape') {
                languageSwitcher.classList.remove('active');
            }
        });
        
        // Handle click outside to close
        document.addEventListener('click', (e) => {
            if (!languageSwitcher.contains(e.target)) {
                languageSwitcher.classList.remove('active');
            }
        });
        
        // Handle touch events for mobile
        let touchStartY = 0;
        languageSwitcher.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        languageSwitcher.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            
            // Prevent accidental triggers from scrolling
            if (Math.abs(deltaY) < 10) {
                languageSwitcher.classList.toggle('active');
            }
        });
    }
}

// Enhanced Scroll Behavior
function initScrollBehavior() {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide navbar on scroll down, show on scroll up (mobile)
        if (window.innerWidth <= 768) {
            if (scrollY > lastScrollY && scrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Reset navbar position on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navbar.style.transform = 'translateY(0)';
        }
    });
}

// Enhanced Smooth Scrolling
function initSmoothScrolling() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = navbar.offsetHeight + 20;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });
    });
}

// Enhanced Animation Observer
function initAnimationObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Animate counters
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
                
                // Animate visitor counter
                if (entry.target.id === 'visitor-count' || entry.target.id === 'page-views') {
                    animateVisitorCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.timeline-item, .analysis-card, .finding-item, .content-section, .stat-number').forEach(el => {
        observer.observe(el);
    });
}

// Enhanced Counter Animation
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas
        const formatted = Math.floor(current).toLocaleString();
        element.textContent = element.textContent.replace(/[\d,]+/, formatted);
    }, 16);
}

// Enhanced Visitor Counter
function initVisitorCounter() {
    const visitorCountElement = document.getElementById('visitor-count');
    const pageViewsElement = document.getElementById('page-views');
    
    if (!visitorCountElement || !pageViewsElement) return;
    
    // Get or initialize visitor data
    let visitorData = JSON.parse(localStorage.getItem('bitcoinManifestoVisitors')) || {
        totalVisitors: 1247,
        totalPageViews: 3891,
        lastVisit: null,
        sessionViews: 0
    };
    
    // Check if new visitor
    const isNewVisitor = !sessionStorage.getItem('bitcoinManifestoSession');
    if (isNewVisitor) {
        visitorData.totalVisitors += Math.floor(Math.random() * 3) + 1;
        sessionStorage.setItem('bitcoinManifestoSession', 'true');
    }
    
    // Increment page views
    visitorData.totalPageViews += 1;
    visitorData.sessionViews += 1;
    visitorData.lastVisit = new Date().toISOString();
    
    // Save updated data
    localStorage.setItem('bitcoinManifestoVisitors', JSON.stringify(visitorData));
    
    // Update display
    visitorCountElement.textContent = visitorData.totalVisitors.toLocaleString();
    pageViewsElement.textContent = visitorData.totalPageViews.toLocaleString();
    
    // Periodic updates
    setInterval(() => {
        const increment = Math.random() < 0.3 ? Math.floor(Math.random() * 2) + 1 : 0;
        if (increment > 0) {
            visitorData.totalVisitors += increment;
            visitorData.totalPageViews += increment;
            localStorage.setItem('bitcoinManifestoVisitors', JSON.stringify(visitorData));
            
            // Animate the update
            animateVisitorCounter(visitorCountElement);
            animateVisitorCounter(pageViewsElement);
        }
    }, 30000);
}

function animateVisitorCounter(element) {
    const currentValue = parseInt(element.textContent.replace(/[^0-9]/g, ''));
    const visitorData = JSON.parse(localStorage.getItem('bitcoinManifestoVisitors'));
    const targetValue = element.id === 'visitor-count' ? visitorData.totalVisitors : visitorData.totalPageViews;
    
    if (currentValue !== targetValue) {
        element.style.transform = 'scale(1.1)';
        element.style.color = 'var(--bitcoin-orange)';
        
        setTimeout(() => {
            element.textContent = targetValue.toLocaleString();
            element.style.transform = 'scale(1)';
            element.style.color = 'var(--primary-color)';
        }, 150);
    }
}

// Enhanced Touch Interactions
function initTouchInteractions() {
    // Add touch feedback for buttons
    const touchElements = document.querySelectorAll('.btn, .nav-link, .analysis-card, .finding-item');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
        
        element.addEventListener('touchcancel', function() {
            this.style.transform = '';
        }, { passive: true });
    });
    
    // Prevent zoom on double tap for specific elements
    const noZoomElements = document.querySelectorAll('.nav-link, .btn, .lang-option');
    noZoomElements.forEach(element => {
        element.addEventListener('touchend', function(e) {
            e.preventDefault();
        });
    });
}

// Enhanced Language Detection and Switching
function initLanguageDetection() {
    // Auto-detect language on first visit
    const hasVisited = localStorage.getItem('bitcoinManifestoLanguage');
    if (!hasVisited) {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        // Redirect to appropriate language if available
        const availableLanguages = ['tr', 'en', 'fr'];
        const currentPath = window.location.pathname;
        
        if (availableLanguages.includes(langCode) && !currentPath.includes(`/${langCode}/`)) {
            const newPath = `/${langCode}${currentPath}`;
            localStorage.setItem('bitcoinManifestoLanguage', langCode);
            
            // Only redirect if not already on a language-specific page
            if (!currentPath.startsWith('/tr/') && !currentPath.startsWith('/en/') && !currentPath.startsWith('/fr/')) {
                window.location.href = newPath;
            }
        }
    }
    
    // Language switching functionality
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const langCode = this.getAttribute('data-lang');
            if (langCode) {
                localStorage.setItem('bitcoinManifestoLanguage', langCode);
                window.location.href = this.href;
            }
        });
    });
}

// Enhanced Performance Optimizations
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const preloadLinks = [
        '/assets/css/main.css',
        '/assets/css/pages.css',
        '/assets/images/bitcoin-logo.svg'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = href.endsWith('.css') ? 'style' : 'image';
        document.head.appendChild(link);
    });
}

// Enhanced Accessibility Features
function initAccessibilityFeatures() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--bitcoin-orange);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('.hero') || document.querySelector('.page-content');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
    }
    
    // Enhanced focus management
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Enhanced Error Handling
function initErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        
        // Fallback for critical functionality
        if (e.error.message.includes('IntersectionObserver')) {
            // Fallback animation trigger
            setTimeout(() => {
                document.querySelectorAll('.timeline-item, .analysis-card, .finding-item').forEach(el => {
                    el.classList.add('fade-in-up');
                });
            }, 100);
        }
    });
    
    // Service worker registration with error handling
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    initLanguageSwitcher();
    initScrollBehavior();
    initSmoothScrolling();
    initAnimationObserver();
    initVisitorCounter();
    initTouchInteractions();
    initLanguageDetection();
    initPerformanceOptimizations();
    initAccessibilityFeatures();
    initErrorHandling();
});

// Utility Functions
const utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Get visitor statistics
    getVisitorStats: () => {
        return JSON.parse(localStorage.getItem('bitcoinManifestoVisitors')) || {
            totalVisitors: 1247,
            totalPageViews: 3891,
            lastVisit: null,
            sessionViews: 0
        };
    },
    
    // Reset visitor statistics
    resetVisitorStats: () => {
        localStorage.removeItem('bitcoinManifestoVisitors');
        sessionStorage.removeItem('bitcoinManifestoSession');
        location.reload();
    }
};

// Enhanced CSS for mobile optimizations
const additionalStyles = `
    /* Mobile Navigation Enhancements */
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100vh;
        background: var(--bg-color);
        justify-content: center;
        align-items: center;
        gap: 2rem;
        z-index: 1000;
        transition: all 0.3s ease;
    }
    
    .nav-menu.active li {
        opacity: 0;
        transform: translateY(20px);
        animation: slideInUp 0.3s ease forwards;
    }
    
    .nav-menu.active li:nth-child(1) { animation-delay: 0.1s; }
    .nav-menu.active li:nth-child(2) { animation-delay: 0.2s; }
    .nav-menu.active li:nth-child(3) { animation-delay: 0.3s; }
    .nav-menu.active li:nth-child(4) { animation-delay: 0.4s; }
    .nav-menu.active li:nth-child(5) { animation-delay: 0.5s; }
    
    @keyframes slideInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    /* Navbar scroll behavior */
    .navbar {
        transition: transform 0.3s ease, background-color 0.3s ease;
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98) !important;
        box-shadow: var(--shadow-md);
    }
    
    /* Body scroll lock when nav is open */
    body.nav-open {
        overflow: hidden;
        position: fixed;
        width: 100%;
    }
    
    /* Enhanced touch feedback */
    .btn:active,
    .nav-link:active,
    .analysis-card:active,
    .finding-item:active {
        transform: scale(0.98);
        transition: transform 0.1s ease;
    }
    
    /* Skip link styles */
    .skip-link:focus {
        top: 6px !important;
    }
    
    /* Keyboard navigation styles */
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    /* Loading states */
    .loading {
        opacity: 0.6;
        pointer-events: none;
    }
    
    /* Image lazy loading */
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    img.loaded {
        opacity: 1;
    }
    
    /* Visitor counter animations */
    .visitor-counter #visitor-count,
    .visitor-counter #page-views {
        transition: all 0.3s ease;
    }
    
    /* Language switcher enhancements */
    .language-switcher.active .language-dropdown {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    /* Responsive text selection */
    ::selection {
        background: rgba(247, 147, 26, 0.3);
        color: var(--text-color);
    }
    
    /* Smooth scrolling for all browsers */
    html {
        scroll-behavior: smooth;
    }
    
    /* Enhanced focus indicators */
    @supports selector(:focus-visible) {
        *:focus {
            outline: none;
        }
        
        *:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
    }
`;

// Inject enhanced styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Export utils for external use
window.BitcoinManifestoUtils = utils; 