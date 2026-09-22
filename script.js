
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
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const replyTo = document.getElementById("replyTo");
    if (emailInput && replyTo) replyTo.value = emailInput.value;

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    if (formMessage) formMessage.textContent = "Sending your inquiry…";

    try {
      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData.entries());

      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || (result && result.success === false)) {
        throw new Error(result?.message || "Request failed");
      }

      contactForm.reset();
      if (formMessage) {
        formMessage.textContent = "Thank you! Your inquiry has been sent successfully.";
      }
    } catch (error) {
      if (formMessage) {
        formMessage.textContent = "Unable to send right now. Please try again or contact us on WhatsApp.";
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

const currentYear = document.getElementById("currentYear");
if (currentYear) currentYear.textContent = new Date().getFullYear();
