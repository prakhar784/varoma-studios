const BUSINESS_EMAIL = "hello@varomastudios.com";

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

document.querySelectorAll("#navLinks a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    menuToggle.textContent = "☰";
  });
});

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("service").value = link.dataset.service;
  });
});

document.querySelectorAll("[data-project]").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("message").value = `I am interested in a project similar to: ${link.dataset.project}.`;
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(event.currentTarget);
  const subject = `New Varoma Studios Inquiry — ${data.get("service")}`;
  const body = [
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Phone: ${data.get("phone") || "Not provided"}`,
    `Service: ${data.get("service")}`,
    `Budget: ${data.get("budget") || "Not specified"}`,
    `Timeline: ${data.get("timeline") || "Not specified"}`,
    "",
    "Project details:",
    data.get("message")
  ].join("\n");

  const mailto = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.getElementById("formMessage").textContent =
    "Your email app is opening with the inquiry details.";
  window.location.href = mailto;
});
