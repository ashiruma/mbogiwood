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
            return null; // No token, no user
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/accounts/me/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                return userData;
            } else if (response.status === 401 || response.status === 403) {
                // Token expired or invalid, try refreshing (we'll add refresh logic later)
                console.warn('Access token expired or invalid. User needs to re-authenticate.');
                return null;
            } else {
                console.error('Failed to fetch current user:', response.status, await response.text());
                return null;
            }
        } catch (error) {
            console.error('Network error fetching current user:', error);
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
                <img src="${film.poster_image_url || 'images/default_poster.png'}" alt="Poster for ${film.title}">
                <h3>${film.title}</h3>
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

    // --- Main Logic for Dashboard Redirection / Page Initialization ---
    const dashboardUsernameSpan = document.getElementById('dashboardUsername');
    if (dashboardUsernameSpan) {
        // If on a dashboard page, fetch user data
        fetchCurrentUser().then(user => {
            if (user) {
                dashboardUsernameSpan.textContent = user.username;

                // Dashboard specific logic
                if (window.location.pathname.includes('viewer_dashboard.html')) {
                    // Fetch and render all approved films for viewers
                    // For now, this is a placeholder. We need a backend API for films.
                    // renderFilms(mockFilmsData, 'filmsList'); // Using mock data
                    // renderFilms([], 'purchasedFilmsList', true); // No purchased films initially
                    displayMessage('filmsList', 'Loading available films...', 'info');
                    displayMessage('purchasedFilmsList', 'Loading purchased films...', 'info');
                    // Actual fetching will happen here:
                    // fetchFilmsForViewer(user.id).then(films => renderFilms(films, 'filmsList'));
                    // fetchPurchasedFilms(user.id).then(films => renderFilms(films, 'purchasedFilmsList', true));

                } else if (window.location.pathname.includes('creator_dashboard.html')) {
                    // Fetch and render creator's uploaded films, sales, payouts
                    // renderFilms(mockCreatorFilms, 'creatorFilmsList'); // Using mock data
                    // updateSalesPayoutsSummary(mockSalesData);
                    displayMessage('creatorFilmsList', 'Loading your uploaded films...', 'info');
                    displayMessage('salesPayoutsSummary', 'Loading sales data...', 'info');
                    // Actual fetching will happen here:
                    // fetchCreatorFilms(user.id).then(films => renderFilms(films, 'creatorFilmsList'));
                    // fetchSalesPayouts(user.id).then(data => updateSalesPayoutsSummary(data));

                }
            } else {
                // If user not logged in or token invalid, redirect to login
                alert('You are not logged in. Please log in to access the dashboard.');
                window.location.href = 'login.html';
            }
        });
    }

    // --- Login Form Handling (already defined in previous step, copy here) ---
    // (This part remains the same as in the previous js/script.js update)
    // ... (Your loginForm event listener code) ...

    // --- Registration Form Handling (already defined in previous step, copy here) ---
    // (This part remains the same as in the previous js/script.js update)
    // ... (Your registerForm event listener code) ...

    // --- Main Login/Registration Redirection after successful form submission ---
    // This is the core redirection logic after a successful login/registration
    // This logic is best placed after the API calls in loginForm/registerForm
    // where you set localStorage.setItem and then window.location.href = 'index.html';
    // We'll change the 'index.html' redirect below.

    // This section directly handles what happens after a successful login API call.
    // We need to fetch user data immediately after successful login to determine redirection.
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // ... (existing login logic) ...
            if (response.ok) {
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                displayMessage(messageDivId, 'Login successful!', 'success');

                const user = await fetchCurrentUser(); // Fetch user details immediately
                if (user) {
                    if (user.is_content_creator) {
                        window.location.href = 'creator_dashboard.html';
                    } else if (user.is_staff || user.is_superuser) { // Django admin user
                        window.location.href = `${API_BASE_URL}/admin/`; // Redirect to Django admin
                    } else { // Default to viewer dashboard
                        window.location.href = 'viewer_dashboard.html';
                    }
                } else {
                    // Fallback if user data fetch fails after login, redirect to a default
                    window.location.href = 'index.html';
                }
            }
            // ... (rest of login error handling) ...
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
});
