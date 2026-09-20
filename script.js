
const revealElements = document.querySelectorAll(
  ".services-section, .stats-section, .service-card"
);

const observer = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add("active");

        observer.unobserve(entry.target);

      }

    });

  },
  {
    threshold: 0.15
  }
);

revealElements.forEach((element) => {

  element.classList.add("reveal");

  observer.observe(element);

});

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", (event) => {

  event.preventDefault();

  formMessage.textContent =
    "Thank you! Your demo inquiry has been received.";

  contactForm.reset();

});