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

const visual = document.createElement('div');
visual.className = 'interactive-3d-visual';
visual.setAttribute('role', 'button');
visual.setAttribute('tabindex', '0');
visual.setAttribute('aria-label', 'Interactive rotating 3D Varoma Studios visual. Tap to react.');
visual.innerHTML = '<div class="orb-core"><span>V</span></div><div class="orb-ring ring-one"></div><div class="orb-ring ring-two"></div><div class="orb-ring ring-three"></div><p>Tap to interact</p>';

const hero = document.querySelector('.hero');
if (hero) {
  const target = hero.querySelector('.hero-content') || hero.firstElementChild;
  if (target) target.appendChild(visual);
}

const visualStyles = document.createElement('style');
visualStyles.textContent = `
  .interactive-3d-visual { position: relative; width: 230px; height: 230px; margin: 32px auto 0; perspective: 900px; cursor: pointer; touch-action: manipulation; outline: none; }
  .orb-core { position: absolute; inset: 58px; display: grid; place-items: center; border-radius: 50%; background: radial-gradient(circle at 30% 25%, #b9aaff, #7357ff 42%, #24165f 78%); box-shadow: 0 0 35px rgba(115,87,255,.7), inset -12px -14px 25px rgba(0,0,0,.35); transform-style: preserve-3d; animation: orbFloat 4s ease-in-out infinite; }
  .orb-core span { color: white; font-size: 42px; font-weight: 800; text-shadow: 0 3px 12px rgba(0,0,0,.35); }
  .orb-ring { position: absolute; inset: 24px; border: 2px solid rgba(83,200,255,.75); border-radius: 50%; transform-style: preserve-3d; animation: ringSpin 9s linear infinite; }
  .ring-two { inset: 12px 45px; border-color: rgba(169,149,255,.7); animation-duration: 7s; animation-direction: reverse; transform: rotateY(70deg); }
  .ring-three { inset: 45px 12px; border-color: rgba(115,87,255,.7); animation-duration: 11s; transform: rotateX(70deg); }
  .interactive-3d-visual p { position: absolute; bottom: -18px; width: 100%; text-align: center; color: #aaaac0; font-size: 11px; letter-spacing: .8px; }
  .interactive-3d-visual.is-active .orb-core { animation: orbPulse .65s ease; box-shadow: 0 0 65px rgba(83,200,255,.95), inset -12px -14px 25px rgba(0,0,0,.35); }
  .interactive-3d-visual:focus-visible { border-radius: 30px; box-shadow: 0 0 0 3px #53c8ff; }
  @keyframes ringSpin { from { transform: rotateX(65deg) rotateZ(0deg); } to { transform: rotateX(65deg) rotateZ(360deg); } }
  @keyframes orbFloat { 0%,100% { transform: translateY(0) rotateY(0deg); } 50% { transform: translateY(-10px) rotateY(180deg); } }
  @keyframes orbPulse { 0% { transform: scale(1); } 50% { transform: scale(1.22); } 100% { transform: scale(1); } }
  @media (max-width: 600px) { .interactive-3d-visual { width: 190px; height: 190px; } .orb-core { inset: 48px; } .orb-ring { inset: 18px; } .ring-two { inset: 10px 38px; } .ring-three { inset: 38px 10px; } }
  @media (prefers-reduced-motion: reduce) { .orb-core, .orb-ring { animation: none !important; } .interactive-3d-visual.is-active .orb-core { animation: none !important; transform: scale(1.08); } }
`;
document.head.appendChild(visualStyles);

const activateVisual = () => {
  visual.classList.remove('is-active');
  void visual.offsetWidth;
  visual.classList.add('is-active');
};
visual.addEventListener('click', activateVisual);
visual.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activateVisual(); }
});

const currentYear = document.getElementById('currentYear');
if (currentYear) currentYear.textContent = new Date().getFullYear();
