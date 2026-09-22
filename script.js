
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

if (contactForm) {
  contactForm.addEventListener("submit", () => {
    const emailInput = document.getElementById("email");
    const replyTo = document.getElementById("replyTo");
    if (emailInput && replyTo) replyTo.value = emailInput.value;
    if (formMessage) {
      formMessage.textContent = "Submitting your inquiry…";
    }
  });
}

const currentYear = document.getElementById("currentYear");
if (currentYear) currentYear.textContent = new Date().getFullYear();
