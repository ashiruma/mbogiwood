// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Mbogiwood Productions frontend script loaded!');

    const API_BASE_URL = 'http://127.0.0.1:8000'; // For local development

    // --- Utility function to display messages ---
    function displayMessage(elementId, message, type) {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = 'message ' + type;
            messageElement.style.display = 'block';
        }
    }

    // --- Utility function to hide messages ---
    function hideMessage(elementId) {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.textContent = '';
            messageElement.className = 'message';
            messageElement.style.display = 'none';
        }
    }

    // --- Function to get access token ---
    function getAccessToken() {
        return localStorage.getItem('accessToken');
    }

    // --- Function to fetch current user details ---
    async function fetchCurrentUser() {
        const accessToken = getAccessToken();
        if (!accessToken) {
            console.log('fetchCurrentUser: No access token found.');
            return null;
        }

        try {
            console.log('fetchCurrentUser: Attempting to fetch user data with token...');
            const response = await fetch(`${API_BASE_URL}/api/accounts/me/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('fetchCurrentUser: User data fetched successfully:', userData);
                return userData;
            } else if (response.status === 401 || response.status === 403) {
                console.warn('fetchCurrentUser: Access token expired or invalid. User needs to re-authenticate.');
                // In a full app, you'd try to refresh the token here
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return null;
            } else {
                console.error('fetchCurrentUser: Failed to fetch current user. Status:', response.status, 'Response:', await response.text());
                return null;
            }
        } catch (error) {
            console.error('fetchCurrentUser: Network error fetching current user:', error);
            return null;
        }
    }

    // --- Function to display Films (reusable for different lists) ---
    function renderFilms(films, containerId, isPurchasedList = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = ''; // Clear existing content

        if (films.length === 0) {
            container.innerHTML = `<p>${isPurchasedList ? 'No purchased films yet.' : 'No films available.'}</p>`;
            return;
        }

        films.forEach(film => {
            const filmCard = document.createElement('div');
            filmCard.className = 'movie-card';
            filmCard.innerHTML = `
                <img src="${film.poster_image_url || 'images/default_poster.png'}" alt="Poster for <span class="math-inline">\{film\.title\}"\>
<h3\></span>{film.title}</h3>
                <p>Genre: ${film.genre}</p>
                <p>Director: ${film.director}</p>
                <p>Year: ${film.release_year}</p>
                <p class="price">KES ${parseFloat(film.price).toFixed(2)}</p>
                ${isPurchasedList ?
                    `<button class="buy-btn play-btn" data-video-url="${film.video_file_url}">Play Film</button>` :
                    `<button class="buy-btn purchase-btn" data-film-id="${film.id}" data-film-price="${film.price}">Buy Now</button>`
                }
            `;
            container.appendChild(filmCard);

            if (isPurchasedList) {
                const playButton = filmCard.querySelector('.play-btn');
                if (playButton) {
                    playButton.addEventListener('click', () => {
                        const videoUrl = playButton.dataset.videoUrl;
                        if (videoUrl) {
                            alert(`Playing film: ${film.title}\nVideo URL: ${videoUrl}\n(Actual video player integration will go here!)`);
                            // Here you would open a modal with a video player
                            // e.g., openVideoPlayerModal(videoUrl);
                        } else {
                            alert('Video URL not available.');
                        }
                    });
                }
            } else {
                const purchaseButton = filmCard.querySelector('.purchase-btn');
                if (purchaseButton) {
                    purchaseButton.addEventListener('click', () => {
                        alert(`Proceeding to purchase ${film.title} for KES ${parseFloat(film.price).toFixed(2)}.\n(Payment integration will go here!)`);
                        // Here you would initiate the payment process
                        // e.g., initiatePayment(film.id, film.price);
                    });
                }
            }
        });
    }

    // --- Logout Functionality ---
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            alert('You have been logged out.');
            window.location.href = 'index.html'; // Redirect to homepage
        });
    }

    // --- Login Form Handling ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = loginForm.username.value.trim();
            const password = loginForm.password.value.trim();
            const messageDivId = 'message';

            hideMessage(messageDivId);

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
                    localStorage.setItem('accessToken', data.access);
                    localStorage.setItem('refreshToken', data.refresh);
                    displayMessage(messageDivId, 'Login successful!', 'success');

                    // --- CRITICAL REDIRECTION LOGIC (Consolidated here) ---
                    const user = await fetchCurrentUser(); // Fetch user details immediately
                    console.log('Login Form: User object after successful fetchCurrentUser:', user);

                    if (user) {
                        console.log('Login Form: User is_content_creator:', user.is_content_creator);
                        console.log('Login Form: User is_staff:', user.is_staff);
                        console.log('Login Form: User is_superuser:', user.is_superuser);

                        if (user.is_staff || user.is_superuser) { // Admin users (Django staff/superuser)
                            console.log('Login Form: Redirecting to Admin Dashboard.');
                            window.location.href = `${API_BASE_URL}/admin/`; // Redirect to Django admin
                        } else if (user.is_content_creator) { // Content creators
                            console.log('Login Form: Redirecting to Creator Dashboard.');
                            window.location.href = 'creator_dashboard.html';
                        } else { // Default to viewer dashboard
                            console.log('Login Form: Redirecting to Viewer Dashboard.');
                            window.location.href = 'viewer_dashboard.html';
                        }
                    } else {
                        // Fallback if user data fetch fails after login, redirect to a default
                        console.error('Login Form: Failed to retrieve user details after token. Redirecting to index.');
                        window.location.href = 'index.html';
                    }
                } else {
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
            e.preventDefault();

            const username = registerForm.username.value.trim();
            const email = registerForm.email.value.trim();
            const password = registerForm.password.value.trim();
            const confirmPassword = registerForm.confirm_password.value.trim();
            const isContentCreator = registerForm.is_content_creator.checked;
            const messageDivId = 'message';

            hideMessage(messageDivId);

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
                    displayMessage(messageDivId, 'Registration successful! You can now log in.', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    let errorMessage = 'Registration failed. Please try again.';
                    if (data.username) {
                        errorMessage = `Username: ${data.username.join(', ')}`;
                    } else if (data.email) {
                        errorMessage = `Email: ${data.email.join(', ')}`;
                    } else if (data.password) {
                        errorMessage = `Password: ${data.password.join(', ')}`;
                    } else if (data.detail) {
                        errorMessage = data.detail;
                    } else if (data.non_field_errors) {
                        errorMessage = data.non_field_errors.join(', ');
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

    // --- Main Logic for Dashboard Redirection / Page Initialization ---
    // This runs when any page loads, checks if it's a dashboard, and if user is logged in
    const dashboardUsernameSpan = document.getElementById('dashboardUsername');
    if (dashboardUsernameSpan) { // Only run if on a dashboard page (has this element)
        fetchCurrentUser().then(user => {
            if (user) {
                dashboardUsernameSpan.textContent = user.username;

                // Dashboard specific logic
                if (window.location.pathname.includes('viewer_dashboard.html')) {
                    console.log('Initializing Viewer Dashboard for:', user.username);
                    // Placeholder for fetching and rendering films for viewers
                    displayMessage('filmsList', 'Loading available films...', 'info');
                    displayMessage('purchasedFilmsList', 'Loading purchased films...', 'info');

                } else if (window.location.pathname.includes('creator_dashboard.html')) {
                    console.log('Initializing Creator Dashboard for:', user.username);
                    // Placeholder for fetching and rendering creator's uploaded films, sales, payouts
                    displayMessage('creatorFilmsList', 'Loading your uploaded films...', 'info');
                    displayMessage('salesPayoutsSummary', 'Loading sales data...', 'info');

                }
            } else {
                // If user not logged in or token invalid, redirect to login
                console.log('User not logged in on dashboard page. Redirecting to login.');
                alert('You are not logged in. Please log in to access the dashboard.');
                window.location.href = 'login.html';
            }
        });
    }

    // --- Highlight active navigation link (basic) ---
    // (Existing functionality, ensure it still works with new links)
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href').split('/').pop();
        if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html') ||
            (window.location.pathname.includes('viewer_dashboard.html') && linkHref === 'viewer_dashboard.html') ||
            (window.location.pathname.includes('creator_dashboard.html') && linkHref === 'creator_dashboard.html')) {
            link.classList
