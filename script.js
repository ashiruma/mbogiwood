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
    const response = await fetch("http://127.0.0.1:5000/api/investor-pack"); // Update with your API endpoint
    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "InvestorPack.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    alert("Your download has started!");
  } catch (error) {
    console.error("Error downloading investor pack:", error);
    alert("There was an error downloading the file. Please try again later.");
  }
}

// Function to process the pay-to-watch feature
async function processPayToWatch() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/paytowatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: 1, amount: 5.99 }) // Example data; update as needed
    });
    if (response.ok) {
      alert("Payment successful! Enjoy your film.");
      window.location.href = "paid-content.html?id=1"; // Example redirection
    } else {
      alert("Payment failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during payment:", error);
    alert("An error occurred during payment. Please try again later.");
  }
}

// Function to handle contact form submission
async function handleContactFormSubmission(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();
  const feedback = document.getElementById("formFeedback");

  if (!name || !email || !subject || !message) {
    feedback.innerText = "Please fill out all fields.";
    return;
  }
  
  feedback.innerText = "Sending message...";
  const formData = { name, email, subject, message };

  try {
    const response = await fetch("http://127.0.0.1:5000/api/contact", { // Update with your backend endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      feedback.innerText = "Thank you for contacting us. We'll get back to you soon!";
      document.getElementById("contactForm").reset();
    } else {
      feedback.innerText = "There was an error sending your message. Please try again later.";
    }
  } catch (error) {
    console.error("Error:", error);
    feedback.innerText = "An unexpected error occurred. Please try again later.";
  }
}

// Attach event listeners once the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Load dynamic projects if the container exists
  if (document.getElementById("projectsContainer")) {
    loadProjects();
  }
  
  // Attach investor pack download functionality if button exists
  const investorBtn = document.getElementById("downloadInvestorPackBtn");
  if (investorBtn) {
    investorBtn.addEventListener("click", downloadInvestorPack);
  }
  
  // Attach pay-to-watch functionality if button exists
  const payToWatchBtn = document.getElementById("payToWatchBtn");
  if (payToWatchBtn) {
    payToWatchBtn.addEventListener("click", processPayToWatch);
  }
  
  // Attach contact form submission functionality if the form exists
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactFormSubmission);
  }
});
