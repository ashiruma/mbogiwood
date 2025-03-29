document.addEventListener('DOMContentLoaded', function () {
    // JavaScript code for interactivity will go here

    // Handle hover effect on CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseover', function () {
            this.classList.add('hover');
        });
        button.addEventListener('mouseout', function () {
            this.classList.remove('hover');
        });
    });

    // Example of form validation (Contact Us form)
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Simple validation
            if (name === '' || email === '' || message === '') {
                alert('Please fill in all fields.');
                return;
            }

            // You can add more advanced validation and form submission logic here
            alert('Message sent successfully!');
            contactForm.reset(); // Reset the form
        });
    }
});
