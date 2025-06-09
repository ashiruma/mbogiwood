// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Mbogiwood Productions frontend script loaded!');

    // --- Placeholder for potential future interactivity ---
    // Example: A simple alert when "Lets talk" button is clicked
    const letsTalkBtn = document.querySelector('.btn-talk');
    if (letsTalkBtn) {
        letsTalkBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            alert('Thank you for your interest! We will get back to you soon.');
            console.log('Lets talk button clicked!');
        });
    }

    // Example: Highlight active navigation link (basic)
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href').split('/').pop();
        if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
            link.classList.add('active-nav-link');
        }
    });
});

// You can add more interactive features here as your project evolves.
// For example:
// - A search bar (if you add dynamic content later)
// - Image carousels/sliders for the gallery sections
// - Modals for "buy movie" features (if you build out the membership part)
// - Form submissions (if you add contact/career forms)
