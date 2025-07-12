// Bitcoin Manifesto - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initNavigation();
    
    // Smooth scrolling
    initSmoothScrolling();
    
    // Scroll animations
    initScrollAnimations();
    
    // Statistics counter animation
    initCounterAnimation();
    
    // Mobile menu toggle
    initMobileMenu();
    
    // Typewriter effect for hero title
    initTypewriterEffect();
    
    // Bitcoin price ticker (optional)
    initBitcoinTicker();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Change navbar style on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.analysis-card, .finding-item, .timeline-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Counter animation for statistics
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const countUp = (element, target) => {
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format numbers with commas
            const formattedNumber = Math.floor(current).toLocaleString();
            element.textContent = formattedNumber;
        }, 20);
    };
    
    // Trigger animation when statistics section is visible
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    const target = parseInt(counter.textContent.replace(/,/g, ''));
                    countUp(counter, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Typewriter effect for hero title
function initTypewriterEffect() {
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.innerHTML += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typewriter effect after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Bitcoin price ticker (optional feature)
function initBitcoinTicker() {
    const createTicker = () => {
        // This would integrate with a real API in production
        const ticker = document.createElement('div');
        ticker.className = 'bitcoin-ticker';
        ticker.innerHTML = `
            <div class="ticker-content">
                <span class="ticker-label">BTC/USD:</span>
                <span class="ticker-price" id="btc-price">$108,000</span>
                <span class="ticker-change positive">+2.5%</span>
            </div>
        `;
        
        // Add ticker to page (optional)
        // document.body.appendChild(ticker);
    };
    
    // Uncomment to enable ticker
    // createTicker();
}

// Utility functions
const utils = {
    // Debounce function for performance
    debounce: function(func, wait) {
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
    
    // Format numbers with commas
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Additional CSS for mobile menu (injected via JavaScript)
const additionalStyles = `
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 1rem;
        box-shadow: var(--shadow-lg);
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
    
    .scrolled {
        background: rgba(255, 255, 255, 0.98) !important;
        box-shadow: var(--shadow-md);
    }
    
    .bitcoin-ticker {
        position: fixed;
        top: 70px;
        right: 20px;
        background: var(--gradient-primary);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius);
        font-family: var(--font-mono);
        font-size: 0.9rem;
        z-index: 999;
        box-shadow: var(--shadow-md);
    }
    
    .ticker-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .ticker-change.positive {
        color: #00ff88;
    }
    
    .ticker-change.negative {
        color: #ff4444;
    }
    
    @media (max-width: 768px) {
        .bitcoin-ticker {
            display: none;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Console message for developers
console.log(`
🚀 Bitcoin Manifesto - 4 Temmuz Anomalisi
📊 80,000 BTC Analizi
🔍 Geliştirici araçları aktif
`);

// Export utils for potential use in other scripts
window.BitcoinManifesto = {
    utils: utils,
    
    // Public API for potential extensions
    addCustomAnimation: function(element, animation) {
        element.classList.add(animation);
    },
    
    updateBitcoinPrice: function(price, change) {
        const priceElement = document.getElementById('btc-price');
        const changeElement = document.querySelector('.ticker-change');
        
        if (priceElement) {
            priceElement.textContent = `$${price.toLocaleString()}`;
        }
        
        if (changeElement) {
            changeElement.textContent = `${change > 0 ? '+' : ''}${change}%`;
            changeElement.className = `ticker-change ${change > 0 ? 'positive' : 'negative'}`;
        }
    }
}; 