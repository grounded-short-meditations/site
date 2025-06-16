// Grounded Website - Interactive Features
class GroundedApp {
    constructor() {
        this.isBreathing = false;
        this.breathingTimer = null;
        this.progressTimer = null;
        this.currentTime = 0;
        this.totalTime = 120; // 2 minutes in seconds
        this.currentQuote = 0;
        this.quotes = document.querySelectorAll('.quote');
        this.indicators = document.querySelectorAll('.indicator');
        
        this.init();
    }
    
    init() {
        this.initLucideIcons();
        this.initQuoteCarousel();
        this.initScrollAnimations();
        this.initNavigation();
        this.bindEvents();
    }
    
    initLucideIcons() {
        // Initialize Lucide icons after DOM is loaded
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    initQuoteCarousel() {
        // Auto-rotate quotes every 5 seconds
        setInterval(() => {
            this.nextQuote();
        }, 5000);
        
        // Add click handlers for quote indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.showQuote(index);
            });
        });
    }
    
    nextQuote() {
        this.currentQuote = (this.currentQuote + 1) % this.quotes.length;
        this.showQuote(this.currentQuote);
    }
    
    showQuote(index) {
        // Hide all quotes
        this.quotes.forEach(quote => quote.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Show selected quote
        this.quotes[index].classList.add('active');
        this.indicators[index].classList.add('active');
        
        this.currentQuote = index;
    }
    
    toggleBreathing() {
        const playBtn = document.getElementById('playBtn');
        const playIcon = document.getElementById('playIcon');
        const breathText = document.getElementById('breathText');
        const breathingGuide = document.getElementById('breathingGuide');
        
        if (!this.isBreathing) {
            this.startBreathing();
            playIcon.setAttribute('data-lucide', 'pause');
            breathText.textContent = 'Breathe In...';
            breathingGuide.querySelector('.breath-circle').classList.add('breathing');
        } else {
            this.stopBreathing();
            playIcon.setAttribute('data-lucide', 'play');
            breathText.textContent = 'Click to Begin';
            breathingGuide.querySelector('.breath-circle').classList.remove('breathing');
        }
        
        // Re-initialize icons after changing
        lucide.createIcons();
    }
    
    startBreathing() {
        this.isBreathing = true;
        this.currentTime = 0;
        
        // Breathing cycle: 4 seconds in, 7 seconds hold, 8 seconds out
        const breathingCycle = () => {
            const breathText = document.getElementById('breathText');
            const phases = [
                { text: 'Breathe In...', duration: 4000 },
                { text: 'Hold...', duration: 7000 },
                { text: 'Breathe Out...', duration: 8000 }
            ];
            
            let phaseIndex = 0;
            
            const updatePhase = () => {
                if (!this.isBreathing) return;
                
                breathText.textContent = phases[phaseIndex].text;
                phaseIndex = (phaseIndex + 1) % phases.length;
                
                setTimeout(updatePhase, phases[phaseIndex === 0 ? 2 : phaseIndex - 1].duration);
            };
            
            updatePhase();
        };
        
        breathingCycle();
        this.updateProgress();
    }
    
    stopBreathing() {
        this.isBreathing = false;
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
        }
    }
    
    updateProgress() {
        this.progressTimer = setInterval(() => {
            if (!this.isBreathing) return;
            
            this.currentTime++;
            const progressFill = document.getElementById('progressFill');
            const timeDisplay = document.getElementById('timeDisplay');
            
            const progress = (this.currentTime / this.totalTime) * 100;
            progressFill.style.width = `${Math.min(progress, 100)}%`;
            
            const minutes = Math.floor(this.currentTime / 60);
            const seconds = this.currentTime % 60;
            timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (this.currentTime >= this.totalTime) {
                this.completeBreathing();
            }
        }, 1000);
    }
    
    completeBreathing() {
        this.stopBreathing();
        const breathText = document.getElementById('breathText');
        const breathingGuide = document.getElementById('breathingGuide');
        const playIcon = document.getElementById('playIcon');
        
        breathText.textContent = 'Well Done! 🧘‍♀️';
        breathingGuide.querySelector('.breath-circle').classList.remove('breathing');
        playIcon.setAttribute('data-lucide', 'play');
        
        // Reset after 3 seconds
        setTimeout(() => {
            breathText.textContent = 'Click to Begin';
            document.getElementById('progressFill').style.width = '0%';
            document.getElementById('timeDisplay').textContent = '0:00';
            this.currentTime = 0;
        }, 3000);
        
        lucide.createIcons();
    }
    
    initScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.feature-card, .meditation-content, .download-content');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    initNavigation() {
        const nav = document.querySelector('.nav');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add background when scrolling
            if (scrollTop > 100) {
                nav.style.background = 'rgba(254, 252, 247, 0.98)';
                nav.style.backdropFilter = 'blur(20px)';
                nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                nav.style.background = 'rgba(254, 252, 247, 0.95)';
                nav.style.boxShadow = 'none';
            }
            
            lastScrollTop = scrollTop;
        });
        
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    bindEvents() {
        // Global click handler for meditation start
        window.startMeditation = () => {
            document.getElementById('meditation').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Auto-start breathing after scroll
            setTimeout(() => {
                if (!this.isBreathing) {
                    this.toggleBreathing();
                }
            }, 1000);
        };
        
        // Global breathing toggle
        window.toggleBreathing = () => {
            this.toggleBreathing();
        };
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.toggleBreathing();
            }
        });
        
        // Touch gestures for mobile
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            // Swipe up to start meditation
            if (diff > 50 && Math.abs(diff) < 200) {
                const meditationSection = document.getElementById('meditation');
                if (meditationSection) {
                    meditationSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
    
    // Utility function for zen-like random inspirational moments
    showZenMoment() {
        const zenMoments = [
            "Take a deep breath. You are exactly where you need to be.",
            "In this moment, you are perfect and complete.",
            "Feel your feet on the ground. You are present.",
            "Notice your breath. It's been with you all along.",
            "This too shall pass. You are resilient."
        ];
        
        const randomMoment = zenMoments[Math.floor(Math.random() * zenMoments.length)];
        
        // Create a gentle notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #9CAF88 0%, #F4E6CD 100%);
            color: #2C3E50;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            z-index: 1000;
            font-weight: 500;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.5s ease;
        `;
        
        notification.textContent = randomMoment;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 4000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new GroundedApp();
    
    // Show a zen moment after 30 seconds of being on the page
    setTimeout(() => {
        app.showZenMoment();
    }, 30000);
    
    // Show zen moments periodically (every 5 minutes)
    setInterval(() => {
        app.showZenMoment();
    }, 300000);
});

// Easter egg: Konami code for special zen experience
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Special zen mode activated
        document.body.style.background = 'linear-gradient(45deg, #9CAF88, #F4E6CD, #5B9BD5, #2D5A87)';
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'zenGradient 10s ease infinite';
        
        // Add zen gradient animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes zenGradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
        
        // Show special message
        const specialMessage = document.createElement('div');
        specialMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 2rem;
            border-radius: 24px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(20px);
        `;
        
        specialMessage.innerHTML = `
            <h2 style="color: #2D5A87; margin-bottom: 1rem;">🧘‍♀️ Zen Master Mode Activated</h2>
            <p style="color: #6B7280;">You've unlocked the secret zen experience!<br>
            Take a moment to appreciate this peaceful state.</p>
        `;
        
        document.body.appendChild(specialMessage);
        
        setTimeout(() => {
            document.body.removeChild(specialMessage);
            document.body.style.background = '#FEFCF7';
            document.body.style.animation = 'none';
        }, 5000);
        
        konamiCode = [];
    }
}); 