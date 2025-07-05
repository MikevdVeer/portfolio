// Project Search Functionality
document.getElementById('projectSearch').addEventListener('keyup', function() {
    const searchText = this.value.toLowerCase();
    const projectCards = document.querySelectorAll('.card');
    
    projectCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text').textContent.toLowerCase();
        const technologies = card.querySelector('.text-muted').textContent.toLowerCase();
        
        if (title.includes(searchText) || description.includes(searchText) || technologies.includes(searchText)) {
            card.closest('.col-12').style.display = '';
        } else {
            card.closest('.col-12').style.display = 'none';
        }
    });
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
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Ensure all content is visible on page load
    const allSections = document.querySelectorAll('section');
    const allCards = document.querySelectorAll('.card');
    
    console.log('Found sections:', allSections.length);
    console.log('Found cards:', allCards.length);
    
    allSections.forEach(section => {
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
    });
    
    allCards.forEach(card => {
        card.style.display = 'block';
        card.style.visibility = 'visible';
        card.style.opacity = '1';
    });
    // Project Search with Animation
    const searchInput = document.getElementById('projectSearch');
    const projectCards = document.querySelectorAll('#myProjects .col-12.col-md-3, #myProjects .col-12.col-md-4');
    let searchTimeout;

    // Fallback: if no specific project cards found, get all cards in projects section
    const fallbackCards = projectCards.length === 0 ? document.querySelectorAll('#myProjects .card') : projectCards;

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
            const searchTerm = this.value.toLowerCase();
            
            fallbackCards.forEach(cardWrapper => {
                    const card = cardWrapper.querySelector('.card');
                    if (!card) return;
                    
                    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
                    const description = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
                    const technologies = Array.from(card.querySelectorAll('.badge'))
                        .map(badge => badge.textContent.toLowerCase())
                        .join(' ');

                    const matches = title.includes(searchTerm) || 
                                  description.includes(searchTerm) || 
                                  technologies.includes(searchTerm);

                    // Add Bootstrap fade classes for smooth transitions
                    if (matches) {
                        cardWrapper.style.display = '';
                        cardWrapper.classList.remove('d-none');
                        setTimeout(() => {
                            card.classList.add('shadow-lg');
                            card.classList.add('border-primary');
                        }, 50);
                    } else {
                        card.classList.remove('shadow-lg');
                        card.classList.remove('border-primary');
                        setTimeout(() => {
                            cardWrapper.style.display = 'none';
                            cardWrapper.classList.add('d-none');
                        }, 300);
                    }
                });
            }, 300);
        });
    }

    // Project Filtering with Animation
    const filterButtons = document.querySelectorAll('[data-filter]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            fallbackCards.forEach(cardWrapper => {
                const card = cardWrapper.querySelector('.card');
                if (!card) return;
                
                const badge = card.querySelector('.badge')?.textContent.toLowerCase() || '';
                
                // Reset card styles
                card.classList.remove('shadow-lg', 'border-primary');
                cardWrapper.style.transform = 'scale(1)';
                
                if (filterValue === 'all' || badge.includes(filterValue.toLowerCase())) {
                    // Show matching cards with animation
                    cardWrapper.style.display = '';
                    cardWrapper.classList.remove('d-none');
                    setTimeout(() => {
                        cardWrapper.style.transform = 'scale(1)';
                        card.classList.add('shadow-lg', 'border-primary');
                    }, 50);
                } else {
                    // Hide non-matching cards with animation
                    cardWrapper.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        cardWrapper.style.display = 'none';
                        cardWrapper.classList.add('d-none');
                    }, 300);
                }
            });
        });
    });

    // Add hover effects using Bootstrap classes
    fallbackCards.forEach(cardWrapper => {
        const card = cardWrapper.querySelector('.card');
        if (!card) return;
        
        card.addEventListener('mouseenter', function() {
            this.classList.add('shadow-lg', 'border-primary');
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('shadow-lg', 'border-primary');
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



    // Scroll to top button functionality
    const scrollTopButton = document.querySelector('.scroll-to-top');
    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopButton.style.display = 'block';
            } else {
                scrollTopButton.style.display = 'none';
            }
        });

        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});