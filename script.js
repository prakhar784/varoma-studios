const revealElements = document.querySelectorAll('.services-section, .stats-section, .service-card');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((element) => {
    element.classList.add('reveal');
    observer.observe(element);
  });
}

const logoStyles = document.createElement('style');
logoStyles.textContent = `
  .navbar .logo, .site-footer .logo { display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px 8px 12px; background: linear-gradient(135deg, #101521, #080b14); clip-path: polygon(0 0, 94% 0, 100% 50%, 94% 100%, 0 100%); border-radius: 8px; }
  .logo-mark { display: grid; place-items: center; width: 34px; height: 38px; color: #fff; font-size: 32px; font-weight: 900; font-style: italic; line-height: 1; background: linear-gradient(145deg, #ffffff 8%, #53c8ff 48%, #7357ff 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 8px rgba(83,200,255,.22)); }
  .logo-copy { display: flex; flex-direction: column; gap: 3px; line-height: 1; }
  .logo-copy strong { color: #fff; font-size: 15px; letter-spacing: .45px; white-space: nowrap; }
  .logo-copy strong span { color: #fff; }
  .logo-copy small { color: #b5b8c8; font-size: 6.5px; letter-spacing: 1.7px; text-align: center; white-space: nowrap; margin-top: 2px; }
  .hero-video-wrap { overflow: hidden; }
  .hero-video { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: inherit; }
  @media (max-width: 600px) { .navbar .logo, .site-footer .logo { padding: 6px 12px 6px 8px; gap: 5px; } .logo-mark { width: 28px; height: 32px; font-size: 27px; } .logo-copy strong { font-size: 12px; } .logo-copy small { font-size: 5.5px; letter-spacing: 1.35px; } }
`;
document.head.appendChild(logoStyles);

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const emailInput = document.getElementById('email');
    const replyTo = document.getElementById('replyTo');
    if (emailInput && replyTo) replyTo.value = emailInput.value.trim();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    if (formMessage) formMessage.textContent = 'Sending your inquiry…';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || (result && result.success === false)) throw new Error('Request failed');
      contactForm.reset();
      if (formMessage) formMessage.textContent = 'Thank you! Your inquiry has been sent successfully.';
    } catch (error) {
      console.error('Form submission error:', error);
      if (formMessage) formMessage.textContent = 'Unable to send right now. Please try again or contact us on WhatsApp.';
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

const pricingSection = document.createElement('section');
pricingSection.className = 'pricing-section';
pricingSection.id = 'pricing';
pricingSection.innerHTML = `
  <div class="section-heading">
    <p class="tagline">✦ LAUNCH PRICING</p>
    <h2>Quality Work. <span>Affordable Rates.</span></h2>
    <p>Transparent introductory pricing. Final quotes depend on your project requirements.</p>
  </div>
  <div class="pricing-grid">
    ${[
      ['STUDENT', 'Portfolio Website', '₹1,499+', 'Personal portfolio, resume and project showcase.'],
      ['STARTER', 'Basic Website', '₹2,999+', 'Simple business websites and landing pages.'],
      ['POPULAR', 'Standard Website', '₹4,999+', 'Complete website for growing businesses.', 'featured'],
      ['BUSINESS', 'WhatsApp Website', '₹4,999+', 'Website with WhatsApp inquiry integration.'],
      ['ADVANCED', 'Premium Website', '₹8,999+', 'Advanced design, features and custom experiences.'],
      ['E-COMMERCE', 'Online Store', '₹7,999+', 'Product showcase and online selling features.'],
      ['MOBILE', 'App Development', '₹9,999+', 'Mobile app development based on project scope.'],
      ['DESIGN', 'UI/UX Design', '₹1,999+', 'Clean, modern and user-focused interface design.'],
      ['CUSTOM', 'AI Solutions', 'Custom', 'AI features and automation tailored to your business.']
    ].map(([label, name, price, description, featured = '']) => `
      <article class="pricing-card ${featured}">
        <p class="pricing-label">${label}</p>
        <h3>${name}</h3>
        <p class="pricing-price">${price.includes('+') ? price.replace('+', '<span>+</span>') : price}</p>
        <p>${description}</p>
        <a class="primary-button" href="#contact">Get a Free Quote →</a>
      </article>
    `).join('')}
  </div>
`;

const contactSection = document.getElementById('contact');
if (contactSection && contactSection.parentNode) contactSection.parentNode.insertBefore(pricingSection, contactSection);

const pricingStyles = document.createElement('style');
pricingStyles.textContent = `
  .pricing-section { padding: 110px 8%; background: radial-gradient(circle at top right, rgba(115,87,255,.10), transparent 38%), #080812; }
  .pricing-section .section-heading { margin-inline: auto; text-align: center; }
  .pricing-section .section-heading > p:last-child { margin-inline: auto; }
  .pricing-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: stretch; }
  .pricing-card { position: relative; display: flex; flex-direction: column; padding: 32px 28px; min-height: 350px; background: linear-gradient(155deg, rgba(30,27,58,.98), rgba(15,15,31,.98)); border: 1px solid #302d52; border-radius: 22px; box-shadow: 0 15px 45px rgba(0,0,0,.2); transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
  .pricing-card:hover { transform: translateY(-8px); border-color: #7357ff; box-shadow: 0 20px 55px rgba(115,87,255,.18); }
  .pricing-card.featured { border-color: #7357ff; background: linear-gradient(155deg, rgba(53,39,101,.98), rgba(17,17,38,.98)); box-shadow: 0 18px 60px rgba(115,87,255,.16); }
  .pricing-card.featured::before { content: 'RECOMMENDED'; position: absolute; top: -12px; right: 22px; padding: 6px 12px; border-radius: 999px; background: linear-gradient(90deg,#7357ff,#53c8ff); color: white; font-size: 10px; font-weight: 700; letter-spacing: .8px; }
  .pricing-label { color: #a995ff; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 18px; }
  .pricing-card h3 { font-size: 24px; margin-bottom: 16px; }
  .pricing-price { color: white; font-size: 31px; font-weight: 700; margin-bottom: 18px; }
  .pricing-price span { color: #a995ff; font-size: 18px; }
  .pricing-card > p:not(.pricing-label):not(.pricing-price) { color: #aaaac0; line-height: 1.65; margin-bottom: 28px; }
  .pricing-card .primary-button { margin-top: auto; text-align: center; width: 100%; }
  @media (max-width: 1100px) { .pricing-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 600px) { .pricing-section { padding: 75px 6%; } .pricing-grid { grid-template-columns: 1fr; } .pricing-card { min-height: 320px; } }
`;
document.head.appendChild(pricingStyles);

const currentYear = document.getElementById('currentYear');
if (currentYear) currentYear.textContent = new Date().getFullYear();
