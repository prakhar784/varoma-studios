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

const pricingStyles = document.createElement("style");
pricingStyles.textContent = `
  .pricing-section {
    padding: 110px 8%;
    background: radial-gradient(circle at top right, rgba(115, 87, 255, 0.10), transparent 38%), #080812;
  }

  .pricing-section .section-heading {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  .pricing-section .section-heading > p:last-child {
    margin-left: auto;
    margin-right: auto;
  }

  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
    align-items: stretch;
  }

  .pricing-card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 32px 28px;
    min-height: 350px;
    background: linear-gradient(155deg, rgba(30, 27, 58, 0.98), rgba(15, 15, 31, 0.98));
    border: 1px solid #302d52;
    border-radius: 22px;
    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.20);
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .pricing-card:hover {
    transform: translateY(-8px);
    border-color: #7357ff;
    box-shadow: 0 20px 55px rgba(115, 87, 255, 0.18);
  }

  .pricing-card.featured {
    border-color: #7357ff;
    background: linear-gradient(155deg, rgba(53, 39, 101, 0.98), rgba(17, 17, 38, 0.98));
    box-shadow: 0 18px 60px rgba(115, 87, 255, 0.16);
  }

  .pricing-card.featured::before {
    content: "RECOMMENDED";
    position: absolute;
    top: -12px;
    right: 22px;
    padding: 6px 12px;
    border-radius: 999px;
    background: linear-gradient(90deg, #7357ff, #53c8ff);
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
  }

  .pricing-label {
    color: #a995ff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    margin-bottom: 18px;
  }

  .pricing-card h3 {
    font-size: 24px;
    margin-bottom: 16px;
  }

  .pricing-price {
    color: #ffffff;
    font-size: 31px;
    font-weight: 700;
    margin-bottom: 18px;
  }

  .pricing-price span {
    color: #a995ff;
    font-size: 18px;
  }

  .pricing-card > p:not(.pricing-label):not(.pricing-price) {
    color: #aaaac0;
    line-height: 1.65;
    margin-bottom: 28px;
  }

  .pricing-card .primary-button {
    margin-top: auto;
    text-align: center;
    width: 100%;
  }

  @media (max-width: 1100px) {
    .pricing-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 600px) {
    .pricing-section {
      padding: 75px 6%;
    }

    .pricing-grid {
      grid-template-columns: 1fr;
    }

    .pricing-card {
      min-height: 320px;
    }
  }
`;
document.head.appendChild(pricingStyles);

const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
