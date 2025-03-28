Here is how you can develop a working "Contact Us" form for your website. Below are the updated `index.html` and `script.js` files with the necessary changes.

### Updated `index.html`
````html name=index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mbogiwood Productions</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    /* Base Reset & Global Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html {
      scroll-behavior: smooth;
    }
    body {
      font-family: 'Poppins', sans-serif;
      background-color: #000;
      color: #f0f0f0;
      line-height: 1.6;
    }

    /* Color Variables */
    :root {
      --primary-green: #008000;
      --primary-yellow: #FFD700;
      --primary-brown: #8B4513;
      --primary-black: #000000;
      --primary-white: #ffffff;
    }

    /* Header & Navigation */
    header {
      position: fixed;
      top: 0;
      width: 100%;
      background: linear-gradient(90deg, var(--primary-green), var(--primary-brown));
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.8);
    }
    header img {
      max-width: 120px;
      transition: transform 0.3s ease;
    }
    header img:hover {
      transform: scale(1.05);
    }
    nav {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    nav a {
      color: var(--primary-white);
      font-weight: 600;
      padding: 0.5rem 1rem;
      transition: background 0.3s ease, color 0.3s ease;
    }
    nav a:hover, nav a:focus {
      background: var(--primary-yellow);
      color: var(--primary-black);
      border-radius: 4px;
    }

    /* Hero Section with Parallax Effect */
    .hero {
      height: 100vh;
      background: url('hero-background.jpg') center/cover no-repeat fixed;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      margin-top: 80px;
      animation: fadeIn 2s ease-out;
    }
    .hero::after {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.5);
    }
    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 800px;
      padding: 0 1rem;
    }
    .hero-content h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .hero-content p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Buttons */
    .btn {
      background-color: var(--primary-yellow);
      color: var(--primary-black);
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.3s ease, background-color 0.3s ease;
      margin: 0.5rem;
    }
    .btn:hover, .btn:focus {
      background-color: var(--primary-brown);
      color: var(--primary-white);
      transform: scale(1.05);
    }

    /* Sections */
    section {
      padding: 4rem 2rem;
      text-align: center;
    }
    .section-title {
      font-size: 2rem;
      margin-bottom: 2rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 2px solid var(--primary-yellow);
      display: inline-block;
      padding-bottom: 0.5rem;
    }

    /* Responsive Grid using auto-fit */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin: 2rem 0;
    }

    /* Card Styling */
    .card {
      background: var(--primary-black);
      padding: 1rem;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.7);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.9);
    }
    .card img {
      width: 100%;
      border-radius: 5px;
      margin-bottom: 1rem;
    }

    /* Animated Loading Spinner */
    .spinner {
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid var(--primary-yellow);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 2rem auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Pay To Watch Section */
    .pay-to-watch {
      padding: 4rem 2rem;
      background: var(--primary-black);
      text-align: center;
      border-top: 2px solid var(--primary-yellow);
    }
    .pay-to-watch h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .pay-to-watch p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    /* Contact Form Feedback Animation */
    .message {
      animation: bounce 0.5s;
    }
    @keyframes bounce {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    /* Footer */
    footer {
      background: var(--primary-green);
      padding: 1rem 2rem;
      text-align: center;
      margin-top: 40px;
    }
    footer nav a {
      margin: 0 0.5rem;
      color: var(--primary-white);
      font-weight: 600;
      transition: color 0.3s ease;
    }
    footer nav a:hover {
      color: var(--primary-yellow);
    }

    /* Responsive Media Queries */
    @media (max-width: 1024px) {
      .hero-content h1 { font-size: 2.75rem; }
      .hero-content p { font-size: 1.1rem; }
    }
    @media (max-width: 768px) {
      header { flex-direction: column; }
      nav { justify-content: center; }
      .hero { height: 80vh; }
      .hero-content h1 { font-size: 2.5rem; }
      .grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      header { padding: 15px 1rem; }
      nav a { padding: 6px 10px; font-size: 0.9rem; }
      .section-title { font-size: 1.75rem; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header>
    <img src="logo.png" alt="Mbogiwood Logo">
    <nav>
      <a href="projects.html">Projects</a>
      <a href="about.html">About Us</a>
      <a href="contact.html">Contact</a>
      <a href="news.html">News Update</a>
      <div class="dropdown">
        <a href="#">More</a>
        <div class="dropdown-content">
          <a href="employment.html">Employment</a>
          <a href="subscriptions.html">Subscriptions</a>
        </div>
      </div>
    </nav>
  </header>
  
  <!-- Main Content -->
  <main>
    <!-- Hero Section -->
    <section class="hero" id="hero" aria-label="Hero Section">
      <div class="hero-content">
        <h1>Empowering Kenyan Stories</h1>
        <p>Invest in talent, drive subscriptions, and create employment through film.</p>
        <button class="btn" onclick="location.href='projects.html'">Explore Projects</button>
        <button class="btn" onclick="location.href='investors.html'">Invest with Us</button>
      </div>
    </section>
    
    <!-- Featured Projects Section -->
    <section id="projects" aria-labelledby="projects-title">
      <h2 class="section-title" id="projects-title">Featured Projects</h2>
      <div id="projectsContainer" class="grid">
        <div id="projectsSpinner" class="spinner"></div>
      </div>
    </section>
    
    <!-- Investors Section -->
    <section id="investors" style="background:#1e1e1e;" aria-labelledby="investors-title">
      <h2 class="section-title" id="investors-title">Investment Opportunities</h2>
      <p>Discover growth potential and success stories. Download our investor pack for detailed projections.</p>
      <button class="btn" id="downloadInvestorPackBtn">Download Investor Pack</button>
    </section>
    
    <!-- Subscriptions Section -->
    <section id="subscriptions" aria-labelledby="subscriptions-title">
      <h2 class="section-title" id="subscriptions-title">Become a Member</h2>
      <p>Join our community for exclusive content, early screenings, and networking opportunities.</p>
      <!-- Backend must enforce unique account creation (e.g., unique email) -->
      <form id="subscriptionForm" style="max-width:400px; margin:0 auto;">
        <input type="email" placeholder="Email" aria-label="Email" required style="width:100%; padding:0.75rem; margin-bottom:1rem; border:none; border-radius:5px;">
        <input type="password" placeholder="Password" aria-label="Password" required style="width:100%; padding:0.75rem; margin-bottom:1rem; border:none; border-radius:5px;">
        <button type="submit" class="btn" style="width:100%;">Sign Up</button>
      </form>
    </section>
    
    <!-- Employment Section -->
    <section id="employment" style="background:#1e1e1e;" aria-labelledby="employment-title">
      <h2 class="section-title" id="employment-title">Join Our Team</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel ligula id mauris euismod tincidunt.</p>
      <div class="grid">
        <div class="card">
          <h3>Job Title 1</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
          <button class="btn">Apply Now</button>
        </div>
        <div class="card">
          <h3>Job Title 2</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
          <button class="btn">Apply Now</button>
        </div>
        <div class="card">
          <h3>Job Title 3</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
          <button class="btn">Apply Now</button>
        </div>
      </div>
    </section>
    
    <!-- Latest News Section -->
    <section id="news" aria-labelledby="news-title">
      <h2 class="section-title" id="news-title">Latest News & Updates</h2>
      <div class="grid">
        <div class="card">
          <h3><a href="news-detail.html?id=1">News Headline 1</a></h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
          <a href="news-detail.html?id=1" class="btn">Read More</a>
        </div>
        <div class="card">
          <h3><a href="news-detail.html?id=2">News Headline 2</a></h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
          <a href="news-detail.html?id=2" class="btn">Read More</a>
        </div>
        <div class="card">
          <h3><a href="news-detail.html?id=3">News Headline 3</a></h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
          <a href="news-detail.html?id=3" class="btn">Read More</a>
        </div>
      </div>
    </section>
    
    <!-- Pay To Watch Section -->
    <section id="paytowatch" class="pay-to-watch" aria-labelledby="paytowatch-title">
      <h2 id="paytowatch-title">Pay to Watch</h2>
      <p>Access exclusive films by paying a small fee. Enjoy premium content tailored for cinephiles.</p>
      <button class="btn" id="payToWatchBtn">Pay Now to Watch</button>
    </section>
    
    <!-- Contact Section -->
    <section id="contact" aria-labelledby="contact-title">
      <h2 class="section-title" id="contact-title">Contact Us</h2>
      <form id="contactForm" style="max-width:500px; margin:0 auto; text-align:left;">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" placeholder="Your name" required>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" placeholder="Your email" required>
        
        <label for="subject">Subject:</label>
        <input type="text" id="subject" name="subject" placeholder="Subject" required>
        
        <label for="message">Message:</label>
        <textarea id="message" name="message" rows="5" placeholder="Your message" required></textarea>
        
        <button type="submit" class="btn">Submit</button>
      </form>
      <p id="formFeedback" class="message"></p>
    </section>
  </main>
  
  <!-- Footer -->
  <footer id="footer" aria-label="Footer">
    <nav>
      <a href="projects.html">Projects</a>
      <a href="about.html">About Us</a>
      <a href="contact.html">Contact</a>
      <a href="news.html">News Update</a>
      <div class="dropdown">
        <a href="#">More</a>
        <div class="dropdown-content">
          <a href="employment.html">Employment</a>
          <a href="subscriptions.html">Subscriptions</a>
        </div>
      </div>
    </nav>
    <p>&copy; 2025 Mbogiwood Productions. All Rights Reserved.</p>
    <p>Follow us on 
      <a href="#">Facebook</a>, 
      <a href="#">Instagram</a>, 
      <a href="#">LinkedIn</a>
    </p>
  </footer>
  
  <!-- JavaScript: Dynamic Content Integration & Functional Buttons -->
  <script src="script.js"></script>
</body>
</html>
````

### Updated `script.js`
````javascript name=script.js
// Initialize AOS for scroll animations
AOS.init({
  duration: 1000,
  once: true,
});

// Utility function to show a spinner in a container
function showSpinner(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<div class="spinner"></div>`;
}

// Function to load dynamic projects from the backend API
async function loadProjects() {
  const projectsContainer = document.getElementById("projectsContainer");
  showSpinner("projectsContainer");
  try {
    const response = await fetch("http://127.0.0.1:5000/api/projects"); // Update with your backend endpoint
    if (!response.ok) throw new Error("Network response was not ok");
    const projects = await response.json();
    projectsContainer.innerHTML = ""; // Clear spinner
    projects.forEach(project => {
      const card = document.createElement("div");
      card.className = "card";
      // Use a video element as a placeholder for project content
      card.innerHTML = `
        <video class="project-video" controls>
          <source src="${project.video || 'placeholder-video.mp4'}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <button class="btn" onclick="location.href='project-details.html?id=${project.id}'">View Details</button>
      `;
      projectsContainer.appendChild(card);
    });
    AOS.refresh(); // Refresh AOS to animate newly added elements
  } catch (error) {
    console.error("Error loading projects:", error);
    projectsContainer.innerHTML = "<p class='loading'>Failed to load projects. Please try again later.</p>";
  }
}

// Function to download the investor pack
async function downloadInvestorPack() {
  try {
    const response =
