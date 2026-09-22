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
visual.setAttribute('aria-label', 'Animated floating app screens');
visual.innerHTML = `
  <div class="app-orbit orbit-back"></div>
  <div class="app-orbit orbit-front"></div>
  <div class="app-screen screen-left"><span class="screen-notch"></span><span class="screen-line wide"></span><span class="screen-line"></span><span class="screen-line short"></span><span class="screen-chart"></span></div>
  <div class="app-screen screen-main"><span class="screen-notch"></span><span class="screen-title">GROW</span><span class="screen-line wide"></span><span class="screen-line"></span><span class="screen-line short"></span><span class="screen-button">START</span></div>
  <div class="app-screen screen-right"><span class="screen-notch"></span><span class="screen-avatar"></span><span class="screen-line wide"></span><span class="screen-line"></span><span class="screen-button small">GO</span></div>
`;

const servicesHeading = document.querySelector('.services-section .section-heading');
if (servicesHeading) {
  servicesHeading.classList.add('heading-with-3d');
  servicesHeading.appendChild(visual);
} else {
  const hero = document.querySelector('.hero');
  if (hero) {
    const target = hero.querySelector('.hero-content') || hero.firstElementChild;
    if (target) target.appendChild(visual);
  }
}

const visualStyles = document.createElement('style');
visualStyles.textContent = `
  .heading-with-3d { display: flex; align-items: center; justify-content: center; gap: 42px; text-align: left !important; }
  .heading-with-3d > *:not(.interactive-3d-visual) { max-width: 620px; }
  .interactive-3d-visual { position: relative; flex: 0 0 260px; width: 260px; height: 250px; margin: 0; perspective: 1000px; cursor: pointer; touch-action: manipulation; outline: none; transform-style: preserve-3d; animation: appFloat 5s ease-in-out infinite; }
  .app-orbit { position: absolute; left: 8px; top: 25px; width: 244px; height: 190px; border: 1px solid rgba(83,200,255,.5); border-radius: 50%; transform: rotate(-22deg); animation: orbitRotate 12s linear infinite; box-shadow: 0 0 20px rgba(83,200,255,.12); }
  .orbit-front { transform: rotate(35deg) scale(.82); border-color: rgba(169,149,255,.65); animation-direction: reverse; animation-duration: 9s; }
  .app-screen { position: absolute; display: flex; flex-direction: column; align-items: flex-start; gap: 9px; width: 112px; height: 188px; padding: 23px 12px 12px; border: 1px solid rgba(169,149,255,.65); border-radius: 17px; background: linear-gradient(145deg, rgba(50,43,103,.98), rgba(13,18,49,.98)); box-shadow: 0 16px 38px rgba(0,0,0,.38), 0 0 25px rgba(115,87,255,.22); transform-style: preserve-3d; }
  .screen-main { left: 74px; top: 25px; z-index: 3; transform: rotateY(-12deg) rotateZ(-2deg); animation: mainScreenMotion 7s ease-in-out infinite; }
  .screen-left { left: 5px; top: 53px; z-index: 2; transform: rotateY(28deg) rotateZ(-13deg) scale(.82); opacity: .85; animation: sideScreenMotion 6s ease-in-out infinite; }
  .screen-right { right: 2px; top: 52px; z-index: 2; transform: rotateY(-30deg) rotateZ(13deg) scale(.82); opacity: .85; animation: sideScreenMotion 6s ease-in-out infinite reverse; }
  .screen-notch { position: absolute; top: 8px; left: 50%; width: 34px; height: 5px; border-radius: 99px; background: rgba(255,255,255,.35); transform: translateX(-50%); }
  .screen-title { color: #fff; font-size: 15px; font-weight: 800; letter-spacing: 1px; margin-top: 6px; }
  .screen-line { display: block; width: 70%; height: 5px; border-radius: 8px; background: rgba(185,170,255,.65); }
  .screen-line.wide { width: 92%; background: rgba(83,200,255,.8); }
  .screen-line.short { width: 45%; }
  .screen-chart { width: 100%; height: 45px; margin-top: 9px; border-radius: 8px; background: linear-gradient(155deg, rgba(83,200,255,.8), rgba(115,87,255,.2)); clip-path: polygon(0 90%, 18% 62%, 32% 72%, 48% 28%, 64% 48%, 82% 8%, 100% 25%, 100% 100%, 0 100%); }
  .screen-avatar { width: 28px; height: 28px; margin-top: 6px; border-radius: 50%; background: radial-gradient(circle at 35% 25%, #d7ceff, #7357ff 60%, #2a1b69); }
  .screen-button { margin-top: auto; width: 100%; padding: 7px 4px; border-radius: 7px; text-align: center; font-size: 9px; font-weight: 800; letter-spacing: .7px; color: #fff; background: linear-gradient(90deg, #7357ff, #53c8ff); }
  .screen-button.small { width: 70%; }
  .interactive-3d-visual.is-active .app-screen { animation: appTapPulse .65s ease; }
  .interactive-3d-visual:focus-visible { border-radius: 30px; box-shadow: 0 0 0 3px #53c8ff; }
  @keyframes appFloat { 0%,100% { transform: translateY(0) rotateX(0deg); } 50% { transform: translateY(-10px) rotateX(3deg); } }
  @keyframes orbitRotate { from { transform: rotate(-22deg) rotateZ(0deg); } to { transform: rotate(-22deg) rotateZ(360deg); } }
  @keyframes mainScreenMotion { 0%,100% { transform: rotateY(-12deg) rotateZ(-2deg) translateY(0); } 50% { transform: rotateY(10deg) rotateZ(2deg) translateY(-9px); } }
  @keyframes sideScreenMotion { 0%,100% { translate: 0 0; } 50% { translate: 0 -7px; } }
  @keyframes appTapPulse { 0% { filter: brightness(1); } 50% { filter: brightness(1.65); transform: scale(1.08); } 100% { filter: brightness(1); } }
  @media (max-width: 700px) { .heading-with-3d { flex-direction: column; gap: 24px; text-align: center !important; } .interactive-3d-visual { flex-basis: 230px; width: 230px; height: 230px; } }
  @media (prefers-reduced-motion: reduce) { .interactive-3d-visual, .app-orbit, .app-screen { animation: none !important; } .interactive-3d-visual.is-active .app-screen { animation: none !important; filter: brightness(1.3); } }
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
