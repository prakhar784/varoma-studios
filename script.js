const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((element) => observer.observe(element));

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value.trim();

  const subject = encodeURIComponent(`Varoma Studios Inquiry — ${service}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject Details:\n${message}`
  );

  // Replace this address with your official Varoma Studios email.
  const businessEmail = "YOUR_EMAIL_HERE@example.com";
  window.location.href = `mailto:${businessEmail}?subject=${subject}&body=${body}`;

  formMessage.textContent =
    "Your email app is opening. Replace the business email in script.js before publishing.";
});

document.getElementById("year").textContent = new Date().getFullYear();
