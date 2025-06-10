// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Mbogiwood Productions frontend script loaded!');

    // --- Utility function to display messages ---
    function displayMessage(elementId, message, type) {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = 'message ' + type; // 'message success' or 'message error'
            messageElement.style.display = 'block'; // Ensure it's visible
        }
    }

    // --- Utility function to hide messages ---
    function hideMessage(elementId) {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.textContent = '';
            messageElement.className = 'message';
            messageElement.style.display = 'none'; // Hide it
        }
    }

    // --- API Base URL (Change for production) ---
    // Make sure your Django backend server is running at this URL
    const API_BASE_URL = 'http://127.0.0.1:8000'; // For local development

    // --- Login Form Handling ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const username = loginForm.username.value.trim();
            const password = loginForm.password.value.trim();
            const messageDivId = 'message'; // ID of the message div on login page

            hideMessage(messageDivId); // Clear previous messages

            if (!username || !password) {
                displayMessage(messageDivId, 'Please enter both username/email and password.', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/accounts/token/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Login successful
                    localStorage.setItem('accessToken', data.access);
                    localStorage.setItem('refreshToken', data.refresh);
                    displayMessage(messageDivId, 'Login successful!', 'success');
                    // Redirect to a dashboard or home page after a short delay
                    setTimeout(() => {
                        window.location.href = 'index.html'; // Or 'dashboard.html'
                    }, 1000);
                } else {
                    // Login failed
                    const errorMessage = data.detail || data.non_field_errors || 'Login failed. Please check your credentials.';
                    displayMessage(messageDivId, errorMessage, 'error');
                    console.error('Login error:', data);
                }
            } catch (error) {
                console.error('Network error during login:', error);
                displayMessage(messageDivId, 'Network error. Please try again later.', 'error');
            }
        });
    }

    // --- Registration Form Handling ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const username = registerForm.username.value.trim();
            const email = registerForm.email.value.trim();
            const password = registerForm.password.value.trim();
            const confirmPassword = registerForm.confirm_password.value.trim();
            const isContentCreator = registerForm.is_content_creator.checked;
            const messageDivId = 'message'; // ID of the message div on register page

            hideMessage(messageDivId); // Clear previous messages

            if (!username || !email || !password || !confirmPassword) {
                displayMessage(messageDivId, 'All fields are required.', 'error');
                return;
            }

            if (password !== confirmPassword) {
                displayMessage(messageDivId, 'Passwords do not match.', 'error');
                return;
            }

            // Basic password strength check (can be enhanced on backend)
            if (password.length < 8) {
                displayMessage(messageDivId, 'Password must be at least 8 characters long.', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/accounts/register/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                        is_content_creator: isContentCreator, // Send boolean value
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Registration successful
                    displayMessage(messageDivId, 'Registration successful! You can now log in.', 'success');
                    // Optionally redirect to login page
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    // Registration failed
                    let errorMessage = 'Registration failed. Please try again.';
                    if (data.username) {
                        errorMessage = `Username: ${data.username.join(', ')}`;
                    } else if (data.email) {
                        errorMessage = `Email: ${data.email.join(', ')}`;
                    } else if (data.password) {
                        errorMessage = `Password: ${data.password.join(', ')}`;
                    } else if (data.detail) {
                        errorMessage = data.detail;
                    }
                    displayMessage(messageDivId, errorMessage, 'error');
                    console.error('Registration error:', data);
                }
            } catch (error) {
                console.error('Network error during registration:', error);
                displayMessage(messageDivId, 'Network error. Please try again later.', 'error');
            }
        });
    }

    // --- Highlight active navigation link (basic) ---
    // (Existing functionality, ensure it still works with new links)
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href').split('/').pop();
        // Handle index.html and root path for 'Home'
        if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
            link.classList.add('active-nav-link');
        }
    });

    // --- "Lets talk" button handler (existing, ensure still works) ---
    const letsTalkBtn = document.querySelector('.btn-talk');
    if (letsTalkBtn) {
        letsTalkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Thank you for your interest! We will get back to you soon.');
            console.log('Lets talk button clicked!');
        });
    }

    // --- Placeholder for other frontend functionality (e.g., search) ---
    // You can re-integrate your static search logic here if needed,
    // or adapt it to call the backend API for dynamic movie search later.
});

