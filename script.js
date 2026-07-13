// Mobile Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li a");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});

// Close mobile menu on link click
links.forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
    });
});

// Active Link Highlight on Scroll
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Adjust for navbar height (80px)
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(item => {
        item.classList.remove("active");
        if (item.getAttribute("href").includes(current)) {
            item.classList.add("active");
        }
    });
});

// Subtle Reveal Animation purely vanilla JS (Basic IntersectionObserver)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply initial styles and attach observer
document.addEventListener("DOMContentLoaded", () => {
    const animateElements = document.querySelectorAll('.section-title, .about-content, .project-card, .service-card, .contact-form');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Form Submission Handling
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const formData = new FormData(contactForm);
        const actionUrl = contactForm.getAttribute('action');

        // Basic validation in case required fails in older browsers
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        formStatus.textContent = 'Sending message...';
        formStatus.className = 'form-status show pending';

        try {
            const response = await fetch(actionUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = 'Thanks for reaching out! I will get back to you soon.';
                formStatus.className = 'form-status show success';
                contactForm.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    formStatus.textContent = data.errors.map(error => error.message).join(', ');
                } else {
                    formStatus.textContent = 'Oops! There was a problem submitting your form.';
                }
                formStatus.className = 'form-status show error';
            }
        } catch (error) {
            formStatus.textContent = 'Oops! There was a connection problem. Please try again later.';
            formStatus.className = 'form-status show error';
        }

        // Hide the message after a while
        setTimeout(() => {
            formStatus.classList.remove('show');
        }, 5000);
    });
}

// Project estimator chips selection and text prefill
const serviceChips = document.querySelectorAll("#service-chips .chip-btn");
const messageInput = document.getElementById("message");
const servicesHiddenInput = document.getElementById("selected-services-input");

if (serviceChips.length > 0 && messageInput) {
    serviceChips.forEach(chip => {
        chip.addEventListener("click", () => {
            chip.classList.toggle("selected");
            
            const selectedServices = [];
            serviceChips.forEach(c => {
                if (c.classList.contains("selected")) {
                    selectedServices.push(c.getAttribute("data-value"));
                }
            });

            if (servicesHiddenInput) {
                servicesHiddenInput.value = selectedServices.join(", ");
            }

            if (selectedServices.length > 0) {
                messageInput.value = `Hi Yugeshwar, I'm interested in building a project involving: ${selectedServices.join(", ")}. Let's connect to discuss timelines and details!`;
            } else {
                messageInput.value = "";
            }
        });
    });
}

// Project Inquiry click hook to prefill message
const projectInquiryButtons = document.querySelectorAll(".project-overlay a");
if (projectInquiryButtons.length > 0 && messageInput) {
    projectInquiryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const projectName = btn.getAttribute("data-project");
            if (!projectName) return;

            // Auto-select corresponding chip
            let matchedChip = "";
            if (projectName.includes("Layout")) matchedChip = "Landing Page";
            else if (projectName.includes("Promo")) matchedChip = "Figma to HTML";
            else if (projectName.includes("Kanban")) matchedChip = "Personal Portfolio";

            serviceChips.forEach(c => {
                if (c.getAttribute("data-value") === matchedChip) {
                    c.classList.add("selected");
                } else {
                    c.classList.remove("selected");
                }
            });

            if (servicesHiddenInput) {
                servicesHiddenInput.value = matchedChip;
            }

            messageInput.value = `Hi Yugeshwar, I am impressed by your '${projectName}' and would love to build a similar project for my business. Let's schedule a call!`;
        });
    });
}

