// ================================
// THERAPIST WEBSITE JAVASCRIPT
// ================================

document.addEventListener('DOMContentLoaded', function() {

    // ===== NAVIGATION FUNCTIONALITY =====

    // Get DOM elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu?.contains(event.target);
        const isClickOnHamburger = hamburger?.contains(event.target);

        if (!isClickInsideNav && !isClickOnHamburger && navMenu?.classList.contains('active')) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    });


    // ===== SMOOTH SCROLLING =====

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smooth scroll for CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }


    // ===== ACTIVE NAVIGATION LINK =====

    // Update active nav link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const scrollPosition = window.scrollY + navHeight + 100;

        let activeSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = '#' + section.getAttribute('id');
            }
        });

        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current section link
        if (activeSection) {
            const activeLink = document.querySelector(`.nav-link[href="${activeSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    // Throttle scroll event for performance
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveNavLink();
                handleNavbarBackground();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll);


    // ===== NAVBAR BACKGROUND ON SCROLL =====

    function handleNavbarBackground() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(250, 247, 240, 0.95)';
        } else {
            navbar.style.backgroundColor = 'var(--warm-white)';
        }
    }


    // ===== FORM HANDLING =====

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const formObject = {};

            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Validate form
            if (validateForm(formObject)) {
                // Show success message
                showMessage('Thank you for your message! I will get back to you within 24 hours.', 'success');

                // Reset form
                contactForm.reset();

                // In a real application, you would send this data to your server
                console.log('Form submitted:', formObject);
            } else {
                showMessage('Please fill in all required fields correctly.', 'error');
            }
        });
    }

    // Form validation
    function validateForm(data) {
        // Check required fields
        if (!data.name || !data.email || !data.message) {
            return false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(data.email);


    }

    // Show message to user
    function showMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;

        // Style the message
        messageElement.style.cssText = `
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            font-weight: 500;
            text-align: center;
            ${type === 'success' ?
            'background: rgba(156, 175, 136, 0.1); color: var(--sage-green-dark); border: 1px solid var(--sage-green);' :
            'background: rgba(198, 93, 66, 0.1); color: var(--terracotta-dark); border: 1px solid var(--terracotta);'
        }
        `;

        // Insert message at the top of the form
        const form = document.getElementById('contact-form');
        form.insertBefore(messageElement, form.firstChild);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }


    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====

    // Animate elements when they come into view
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

    // Observe service cards and method cards
    const animatedElements = document.querySelectorAll('.service-card, .method');
    animatedElements.forEach(element => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        // Observe element
        observer.observe(element);
    });


    // ===== FORM INPUT ENHANCEMENTS =====

    // Add floating label effect
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');

    formInputs.forEach(input => {
        // Add focus and blur handlers for enhanced UX
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Check if input has value on page load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });


    // ===== ACCESSIBILITY ENHANCEMENTS =====

    // Keyboard navigation for hamburger menu
    if (hamburger) {
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Escape key to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    });


    // ===== PERFORMANCE OPTIMIZATIONS =====

    // Preload critical images (if any were added)
    function preloadImages() {
        const imageUrls = [
            // Add any critical image URLs here
            // 'images/hero-image.jpg',
            // 'images/about-image.jpg'
        ];

        imageUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = url;
            document.head.appendChild(link);
        });
    }

    // Call preload function
    preloadImages();


    // ===== UTILITY FUNCTIONS =====

    // Debounce function for performance
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Add resize handler with debounce
    const handleResize = debounce(() => {
        // Close mobile menu on resize to larger screen
        if (window.innerWidth > 768 && navMenu?.classList.contains('active')) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    }, 250);

    window.addEventListener('resize', handleResize);


    // ===== CONSOLE MESSAGE =====

    console.log('🌿 Therapist website loaded successfully!');
    console.log('Built with love and attention to accessibility and performance.');

});

// ===== SERVICE WORKER REGISTRATION (Optional) =====
// Uncomment if you want to add offline functionality

/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
*/