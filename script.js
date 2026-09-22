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
  { threshold: 0.15 }
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

    if (emailInput && replyTo) {
      replyTo.value = emailInput.value.trim();
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');

    if (submitButton) submitButton.disabled = true;
    if (formMessage) formMessage.textContent = "Sending your inquiry…";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || (result && result.success === false)) {
        throw new Error(result?.message || "Request failed");
      }

      contactForm.reset();

      if (formMessage) {
        formMessage.textContent =
          "Thank you! Your inquiry has been sent successfully.";
      }
    } catch (error) {
      console.error("Form submission error:", error);

      if (formMessage) {
        formMessage.textContent =
          "Unable to send right now. Please try again or contact us on WhatsApp.";
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

const pricingSection = document.createElement("section");
pricingSection.className = "pricing-section";
pricingSection.id = "pricing";
pricingSection.innerHTML = `
  <div class="section-heading">
    <p class="tagline">✦ LAUNCH PRICING</p>
    <h2>Quality Work. <span>Affordable Rates.</span></h2>
    <p>Get started with transparent introductory pricing. Final quotes depend on your project requirements.</p>
  </div>
  <div class="pricing-grid">
    <article class="pricing-card">
      <p class="pricing-label">STARTER</p>
      <h3>Basic Website</h3>
      <p class="pricing-price">₹2,999<span>+</span></p>
      <p>For simple business websites and landing pages.</p>
      <a class="primary-button" href="#contact">Get a Quote →</a>
    </article>
    <article class="pricing-card featured">
      <p class="pricing-label">POPULAR</p>
      <h3>Standard Website</h3>
      <p class="pricing-price">₹4,999<span>+</span></p>
      <p>For growing businesses needing a complete website.</p>
      <a class="primary-button" href="#contact">Get a Quote →</a>
    </article>
    <article class="pricing-card">
      <p class="pricing-label">ADVANCED</p>
      <h3>Premium Website</h3>
      <p class="pricing-price">₹8,999<span>+</span></p>
      <p>For advanced designs, features and custom experiences.</p>
      <a class="primary-button" href="#contact">Get a Quote →</a>
    </article>
    <article class="pricing-card">
      <p class="pricing-label">MOBILE</p>
      <h3>App Development</h3>
      <p class="pricing-price">₹9,999<span>+</span></p>
      <p>Mobile app concepts and development based on scope.</p>
      <a class="primary-button" href="#contact">Get a Quote →</a>
    </article>
    <article class="pricing-card">
      <p class="pricing-label">DESIGN</p>
      <h3>UI/UX Design</h3>
      <p class="pricing-price">₹1,999<span>+</span></p>
      <p>Clean, modern and user-focused interface design.</p>
      <a class="primary-button" href="#contact">Get a Quote →</a>
    </article>
    <article class="pricing-card">
      <p class="pricing-label">CUSTOM</p>
      <h3>AI Solutions</h3>
      <p class="pricing-price">Custom</p>
      <p>Tailored AI features and automation for your business.</p>
      <a class="primary-button" href="#contact">Discuss Project →</a>
    </article>
  </div>
`;

const contactSection = document.getElementById("contact");
if (contactSection) {
  contactSection.parentNode.insertBefore(pricingSection, contactSection);
}

const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
