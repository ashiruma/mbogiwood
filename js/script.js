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
                console.warn('fetchCurrentUser: Access token expired or invalid. Clearing tokens.');
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

    // --- Login Page Specific Logic (Role Selection & Form Submission) ---
    const loginForm = document.getElementById('loginForm');
    const loginRoleSelectDiv = document.querySelector('.login-role-select');
    const roleButtonsDiv = document.querySelector('.role-buttons');
    const loginAsViewerBtn = document.getElementById('loginAsViewerBtn');
    const loginAsCreatorBtn = document.getElementById('loginAsCreatorBtn');
    const loginRoleInput = document.getElementById('loginRole');
    const backToRoleSelectBtn = document.getElementById('backToRoleSelect');

    if (loginForm) { // Only run if on the login page
        // Handle role selection buttons
        if (loginAsViewerBtn) {
            loginAsViewerBtn.addEventListener('click', () => {
                loginRoleInput.value = 'viewer';
                loginForm.style.display = 'block';
                if (loginRoleSelectDiv) loginRoleSelectDiv.style.display = 'none';
                if (roleButtonsDiv) roleButtonsDiv.style.display = 'none';
            });
        }
        if (loginAsCreatorBtn) {
            loginAsCreatorBtn.addEventListener('click', () => {
                loginRoleInput.value = 'creator';
                loginForm.style.display = 'block';
                if (loginRoleSelectDiv) loginRoleSelectDiv.style.display = 'none';
                if (roleButtonsDiv) roleButtonsDiv.style.display = 'none';
            });
        }
        if (backToRoleSelectBtn) {
            backToRoleSelectBtn.addEventListener('click', () => {
                loginForm.style.display = 'none';
                if (loginRoleSelectDiv) loginRoleSelectDiv.style.display = 'block';
                if (roleButtonsDiv) roleButtonsDiv.style.display = 'flex'; // Use flex for layout
                loginRoleInput.value = '';
                loginForm.reset(); // Clear form fields
                hideMessage('message');
            });
        }

        // Handle the actual login form submission
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = loginForm.username.value.trim();
            const password = loginForm.password.value.trim();
            const selectedLoginRole = loginRoleInput.value; // 'viewer' or 'creator'
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

                    // --- CRITICAL REDIRECTION LOGIC ---
                    const user = await fetchCurrentUser(); // Fetch user details IMMEDIATELY
                    console.log('Login Form: User object after successful fetchCurrentUser:', user);

                    if (user) {
                        console.log('Login Form: Selected Login Role:', selectedLoginRole);
                        console.log('Login Form: User is_content_creator:', user.is_content_creator);
                        console.log('Login Form: User is_staff:', user.is_staff);
                        console.log('Login Form: User is_superuser:', user.is_superuser);


                        // Admin check (highest priority)
                        if (user.is_staff || user.is_superuser) {
                            console.log('Login Form: Redirecting to Admin Dashboard.');
                            window.location.href = `${API_BASE_URL}/admin/`;
                        }
                        // Then check based on selected role AND actual user flags
                        else if (selectedLoginRole === 'creator' && user.is_content_creator) {
                            console.log('Login Form: Redirecting to Creator Dashboard.');
                            window.location.href = 'creator_dashboard.html';
                        }
                        else if (selectedLoginRole === 'viewer' && user.is_film_viewer) {
                            console.log('Login Form: Redirecting to Viewer Dashboard.');
                            window.location.href = 'viewer_dashboard.html';
                        }
                        // Fallback if role selected doesn't match actual user type or other issues
                        else {
                            let redirectMessage = 'Logged in, but your role does not match the selected option or is not fully set up. Redirecting to general view.';
                            if (selectedLoginRole === 'creator' && !user.is_content_creator) {
                                redirectMessage = 'You logged in as a Creator, but your account is not marked as a Content Creator. Please register as a Creator or contact support.';
                            } else if (selectedLoginRole === 'viewer' && !user.is_film_viewer) {
                                redirectMessage = 'You logged in as a Viewer, but your account is not marked as a Film Viewer. Please contact support.';
                            }
                            displayMessage(messageDivId, redirectMessage, 'error');
                            console.warn('Login Form: Role mismatch or no matching dashboard. Redirecting to index.html.');
                            setTimeout(() => { window.location.href = 'index.html'; }, 3000); // Redirect to homepage after message
                        }
                    } else {
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

    // --- Registration Form Handling (already defined, copy here) ---
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
                        is_content_creator: isContentCreator,
                        // For a new viewer, is_film_viewer defaults to true in Django model
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

    // --- Highlight active navigation link (basic) ---
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
