// Dark mode functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeToggleMobile = document.getElementById('dark-mode-toggle-mobile');
    
    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply the theme on page load
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Function to toggle theme
    function toggleTheme() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Add event listeners for both desktop and mobile toggle buttons
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleTheme);
    }
    
    if (darkModeToggleMobile) {
        darkModeToggleMobile.addEventListener('click', toggleTheme);
    }
});

// Particle Animation System
class ParticleAnimation {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.isDark = document.documentElement.classList.contains('dark');
        
        this.init();
    }
    
    init() {
        // Set canvas size
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        this.container.style.position = 'relative';
        this.container.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.resize());
        
        // Handle theme changes
        const observer = new MutationObserver(() => {
            this.isDark = document.documentElement.classList.contains('dark');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        
        // Mouse interaction
        this.mouse = { x: 0, y: 0, radius: 100 };
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.mouse.x = 0;
            this.mouse.y = 0;
        });
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createParticles() {
        const particleCount = Math.min(80, Math.floor(this.canvas.width * this.canvas.height / 8000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 4 + 1,
                opacity: Math.random() * 0.6 + 0.3,
                type: Math.random() > 0.6 ? 'square' : 'circle',
                hue: Math.random() * 60 + 200, // Blue to purple range
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius && this.mouse.x !== 0) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.vx -= Math.cos(angle) * force * 0.5;
                particle.vy -= Math.sin(angle) * force * 0.5;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x <= 0 || particle.x >= this.canvas.width) particle.vx *= -1;
            if (particle.y <= 0 || particle.y >= this.canvas.height) particle.vy *= -1;
            
            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Add some friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Draw particle with enhanced effects
            this.ctx.save();
            
            // Pulsing effect
            const pulseSize = particle.size * (1 + Math.sin(Date.now() * 0.003 + particle.pulse) * 0.2);
            const pulseOpacity = particle.opacity * (0.8 + Math.sin(Date.now() * 0.002 + particle.pulse) * 0.2);
            
            this.ctx.globalAlpha = pulseOpacity;
            
            // Dynamic color based on theme and position
            let hue, saturation, lightness;
            if (this.isDark) {
                hue = particle.hue + Math.sin(Date.now() * 0.001 + index) * 20;
                saturation = 70 + Math.sin(Date.now() * 0.002 + index) * 20;
                lightness = 60 + Math.sin(Date.now() * 0.001 + index) * 20;
            } else {
                hue = particle.hue + Math.sin(Date.now() * 0.001 + index) * 15;
                saturation = 85 + Math.sin(Date.now() * 0.002 + index) * 10;
                lightness = 35 + Math.sin(Date.now() * 0.001 + index) * 10;
            }
            
            this.ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            
            // Add glow effect
            this.ctx.shadowColor = this.ctx.fillStyle;
            this.ctx.shadowBlur = 10;
            
            if (particle.type === 'square') {
                this.ctx.fillRect(particle.x - pulseSize/2, particle.y - pulseSize/2, pulseSize, pulseSize);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, pulseSize/2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
        
        // Draw connections
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        const maxDistance = 120;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.4;
                    const lineWidth = (1 - distance / maxDistance) * 2 + 0.5;
                    
                    this.ctx.save();
                    this.ctx.globalAlpha = opacity;
                    
                    // Dynamic connection color
                    let connectionColor;
                    if (this.isDark) {
                        connectionColor = `hsla(${this.particles[i].hue}, 70%, 60%, ${opacity})`;
                    } else {
                        connectionColor = `hsla(${this.particles[i].hue}, 85%, 35%, ${opacity})`;
                    }
                    
                    this.ctx.strokeStyle = connectionColor;
                    this.ctx.lineWidth = lineWidth;
                    this.ctx.lineCap = 'round';
                    
                    // Add glow to connections
                    this.ctx.shadowColor = connectionColor;
                    this.ctx.shadowBlur = 5;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize particle animation for projects section
document.addEventListener('DOMContentLoaded', function() {
    const projectsSection = document.getElementById('myProjects');
    if (projectsSection) {
        new ParticleAnimation(projectsSection);
    }
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});



// Scroll to Top Button
const scrollToTopButton = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Active Navigation Link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('text-white', 'bg-blue-600');
                link.classList.add('text-gray-300');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.remove('text-gray-300');
                    link.classList.add('text-white', 'bg-blue-600');
                }
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Get all project cards once
    const allProjectCards = document.querySelectorAll('#myProjects .grid > div');
    console.log('Found project cards:', allProjectCards.length); // Debug log
    
    // Test if we can find the filter buttons
    const filterButtons = document.querySelectorAll('[data-filter]');
    console.log('Found filter buttons:', filterButtons.length); // Debug log
    
    let searchTimeout;

    // Project Search with Animation
    const searchInput = document.getElementById('projectSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Add loading state to search input
            this.style.borderColor = '#3b82f6';
            this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                
                allProjectCards.forEach((cardWrapper, index) => {
                    const title = cardWrapper.querySelector('h5')?.textContent.toLowerCase() || '';
                    const description = cardWrapper.querySelector('p')?.textContent.toLowerCase() || '';
                    const technologies = Array.from(cardWrapper.querySelectorAll('.bg-gray-200.dark\\:bg-gray-700, .bg-gray-700'))
                        .map(badge => badge.textContent.toLowerCase())
                        .join(' ');

                    const matches = title.includes(searchTerm) || 
                                  description.includes(searchTerm) || 
                                  technologies.includes(searchTerm);

                    // Add staggered animation delay
                    const delay = index * 50; // 50ms delay between each card

                    if (matches) {
                        // Show matching cards with smooth animation
                        setTimeout(() => {
                            cardWrapper.style.display = '';
                            cardWrapper.classList.remove('hidden');
                            cardWrapper.style.opacity = '0';
                            cardWrapper.style.transform = 'scale(0.9) translateY(20px)';
                            
                            // Animate in
                            requestAnimationFrame(() => {
                                cardWrapper.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                                cardWrapper.style.opacity = '1';
                                cardWrapper.style.transform = 'scale(1) translateY(0)';
                            });
                        }, delay);
                    } else {
                        // Hide non-matching cards with smooth animation
                        cardWrapper.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                        cardWrapper.style.opacity = '0';
                        cardWrapper.style.transform = 'scale(0.9) translateY(-20px)';
                        
                        setTimeout(() => {
                            cardWrapper.style.display = 'none';
                            cardWrapper.classList.add('hidden');
                        }, 300);
                    }
                });
                
                // Reset search input styling after animation completes
                setTimeout(() => {
                    searchInput.style.borderColor = '';
                    searchInput.style.boxShadow = '';
                }, 800);
            }, 400); // Increased delay for search
        });
    }

    // Project Filtering with Animation
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Filter button clicked:', this.getAttribute('data-filter')); // Debug log
            
            // Update active button state with smooth transition
            filterButtons.forEach(btn => {
                btn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-transparent', 'text-gray-600', 'dark:text-gray-300');
            });
            this.classList.remove('bg-transparent', 'text-gray-600', 'dark:text-gray-300');
            this.classList.add('bg-blue-600', 'text-white');
            
            const filterValue = this.getAttribute('data-filter');
            console.log('Filter value:', filterValue); // Debug log
            
            // Add a small delay before filtering for better UX
            setTimeout(() => {
                // Filter with smooth animations
                allProjectCards.forEach((cardWrapper, index) => {
                    const badge = cardWrapper.querySelector('.absolute.top-2.right-2')?.textContent.toLowerCase() || '';
                    console.log('Card badge:', badge); // Debug log
                    
                    // Add staggered animation delay
                    const delay = index * 60; // 60ms delay between each card
                    
                    if (filterValue === 'all' || badge.includes(filterValue.toLowerCase())) {
                        console.log('Showing card with badge:', badge); // Debug log
                        // Show matching cards with smooth animation
                        setTimeout(() => {
                            cardWrapper.style.display = '';
                            cardWrapper.classList.remove('hidden');
                            cardWrapper.style.opacity = '0';
                            cardWrapper.style.transform = 'scale(0.9) translateY(20px)';
                            
                            // Animate in
                            requestAnimationFrame(() => {
                                cardWrapper.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                                cardWrapper.style.opacity = '1';
                                cardWrapper.style.transform = 'scale(1) translateY(0)';
                            });
                        }, delay);
                    } else {
                        console.log('Hiding card with badge:', badge); // Debug log
                        // Hide non-matching cards with smooth animation
                        cardWrapper.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                        cardWrapper.style.opacity = '0';
                        cardWrapper.style.transform = 'scale(0.9) translateY(-20px)';
                        
                        setTimeout(() => {
                            cardWrapper.style.display = 'none';
                            cardWrapper.classList.add('hidden');
                        }, 400);
                    }
                });
            }, 200); // Small delay before starting filter animation
        });
    });

    // Add hover effects using Tailwind classes
    allProjectCards.forEach(cardWrapper => {
        // Test badge detection for each card
        const badge = cardWrapper.querySelector('.absolute.top-2.right-2')?.textContent.toLowerCase() || '';
        console.log('Card badge:', badge); // Debug log
        
        cardWrapper.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        cardWrapper.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Initialize AOS with custom settings
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-in-out',
            disable: 'mobile' // Disable on mobile to prevent issues
        });
    }
});