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

// Contact Form Handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitButton = this.querySelector('button[type="submit"]');
    const spinner = submitButton.querySelector('.spinner-border');
    const buttonText = submitButton.textContent.trim();
    
    // Show loading state
    submitButton.disabled = true;
    spinner.classList.remove('d-none');
    submitButton.textContent = 'Sending...';
    
    const formData = new FormData(this);
    
    fetch('contact.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            this.reset();
            alert(data.message);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    })
    .finally(() => {
        // Reset button state
        submitButton.disabled = false;
        spinner.classList.add('d-none');
        submitButton.textContent = buttonText;
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
    // Project Search with Animation
    const searchInput = document.getElementById('projectSearch');
    const projectCards = document.querySelectorAll('.col-md-3');
    let searchTimeout;

    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = this.value.toLowerCase();
            
            projectCards.forEach(cardWrapper => {
                const card = cardWrapper.querySelector('.card');
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.querySelector('.card-text').textContent.toLowerCase();
                const technologies = Array.from(card.querySelectorAll('.badge'))
                    .map(badge => badge.textContent.toLowerCase())
                    .join(' ');

                const matches = title.includes(searchTerm) || 
                              description.includes(searchTerm) || 
                              technologies.includes(searchTerm);

                // Add Bootstrap fade classes for smooth transitions
                if (matches) {
                    cardWrapper.classList.remove('d-none');
                    setTimeout(() => {
                        card.classList.add('shadow-lg');
                        card.classList.add('border-primary');
                    }, 50);
                } else {
                    card.classList.remove('shadow-lg');
                    card.classList.remove('border-primary');
                    setTimeout(() => {
                        cardWrapper.classList.add('d-none');
                    }, 300);
                }
            });
        }, 300);
    });

    // Project Filtering with Animation
    const filterButtons = document.querySelectorAll('[data-filter]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(cardWrapper => {
                const card = cardWrapper.querySelector('.card');
                const badge = card.querySelector('.badge').textContent.toLowerCase();
                
                // Reset card styles
                card.classList.remove('shadow-lg', 'border-primary');
                cardWrapper.style.transform = 'scale(1)';
                
                if (filterValue === 'all' || badge.includes(filterValue.toLowerCase())) {
                    // Show matching cards with animation
                    cardWrapper.classList.remove('d-none');
                    setTimeout(() => {
                        cardWrapper.style.transform = 'scale(1)';
                        card.classList.add('shadow-lg', 'border-primary');
                    }, 50);
                } else {
                    // Hide non-matching cards with animation
                    cardWrapper.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        cardWrapper.classList.add('d-none');
                    }, 300);
                }
            });
        });
    });

    // Add hover effects using Bootstrap classes
    projectCards.forEach(cardWrapper => {
        const card = cardWrapper.querySelector('.card');
        
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
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
    });

    // Form validation and submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const spinner = submitBtn.querySelector('.spinner-border');
            
            if (!this.checkValidity()) {
                e.stopPropagation();
                this.classList.add('was-validated');
                return;
            }

            // Simulate form submission
            submitBtn.disabled = true;
            spinner.classList.remove('d-none');
            
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                this.reset();
                this.classList.remove('was-validated');
                alert('Message sent successfully!');
            } catch (error) {
                alert('Failed to send message. Please try again.');
            } finally {
                submitBtn.disabled = false;
                spinner.classList.add('d-none');
            }
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