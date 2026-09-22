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

/* Right-side live digital globe animation. The existing left-side content stays untouched. */
const heroVisual = document.querySelector('.hero-video-wrap');
if (heroVisual) {
  heroVisual.classList.add('live-globe-wrap');
  heroVisual.innerHTML = `
    <div class="live-globe" aria-label="Animated digital globe">
      <div class="globe-core"><span>V</span></div>
      <div class="globe-grid"></div>
      <div class="globe-orbit orbit-one"></div>
      <div class="globe-orbit orbit-two"></div>
      <div class="globe-orbit orbit-three"></div>
      <div class="globe-node node-one"></div>
      <div class="globe-node node-two"></div>
      <div class="globe-node node-three"></div>
      <div class="globe-node node-four"></div>
      <div class="globe-label label-web">▣ Web</div>
      <div class="globe-label label-apps">▯ Apps</div>
      <div class="globe-label label-cloud">⌁ Cloud</div>
      <div class="globe-label label-growth">▥ Growth</div>
    </div>
  `;

  const globeStyles = document.createElement('style');
  globeStyles.textContent = `
    .live-globe-wrap { position: relative; flex: 0 0 500px; width: min(100%, 500px); height: 470px; padding: 0; background: transparent; border: 0; box-shadow: none; display: grid; place-items: center; overflow: visible; }
    .live-globe { position: relative; width: 430px; height: 430px; display: grid; place-items: center; filter: drop-shadow(0 0 28px rgba(115,87,255,.22)); animation: globeFloat 6s ease-in-out infinite; }
    .globe-core { position: absolute; width: 245px; height: 245px; border-radius: 50%; background: radial-gradient(circle at 32% 25%, #9c8bff 0 4%, #5542c5 23%, #171b58 58%, #080812 100%); border: 1px solid rgba(130,177,255,.8); box-shadow: inset -25px -20px 55px rgba(0,0,0,.65), 0 0 42px rgba(83,103,255,.48), 0 0 95px rgba(115,87,255,.18); animation: globeSpin 18s linear infinite; display: grid; place-items: center; overflow: hidden; }
    .globe-core::before, .globe-core::after { content: ''; position: absolute; inset: 13px; border: 1px solid rgba(83,200,255,.48); border-radius: 50%; transform: rotate(35deg) scaleX(.42); }
    .globe-core::after { transform: rotate(-35deg) scaleX(.7); border-color: rgba(169,149,255,.55); }
    .globe-core span { position: relative; z-index: 2; color: #fff; font-size: 66px; font-weight: 800; text-shadow: 0 0 20px #a995ff; }
    .globe-grid { position: absolute; width: 270px; height: 270px; border-radius: 50%; background: repeating-linear-gradient(0deg, transparent 0 21px, rgba(83,200,255,.25) 22px 23px), repeating-linear-gradient(90deg, transparent 0 21px, rgba(169,149,255,.22) 22px 23px); mask-image: radial-gradient(circle, black 58%, transparent 71%); -webkit-mask-image: radial-gradient(circle, black 58%, transparent 71%); animation: gridSpin 22s linear infinite reverse; }
    .globe-orbit { position: absolute; width: 405px; height: 150px; border: 1px solid rgba(83,200,255,.75); border-radius: 50%; box-shadow: 0 0 12px rgba(83,200,255,.18); }
    .orbit-one { transform: rotate(25deg); animation: orbitRotate 9s linear infinite; }
    .orbit-two { transform: rotate(-35deg) scaleY(.78); border-color: rgba(169,149,255,.8); animation: orbitRotate 12s linear infinite reverse; }
    .orbit-three { transform: rotate(90deg) scaleY(.58); border-color: rgba(115,87,255,.75); animation: orbitRotate 15s linear infinite; }
    .globe-node { position: absolute; width: 9px; height: 9px; border-radius: 50%; background: #b8f1ff; box-shadow: 0 0 16px 5px rgba(83,200,255,.65); animation: nodePulse 2.4s ease-in-out infinite; }
    .node-one { top: 105px; left: 70px; } .node-two { top: 88px; right: 62px; animation-delay: .5s; } .node-three { bottom: 85px; left: 100px; animation-delay: 1s; } .node-four { bottom: 110px; right: 76px; animation-delay: 1.5s; }
    .globe-label { position: absolute; padding: 12px 18px; border: 1px solid rgba(140,120,255,.7); border-radius: 14px; background: rgba(24,20,61,.9); color: #fff; font-size: 16px; font-weight: 700; box-shadow: 0 0 22px rgba(115,87,255,.2); backdrop-filter: blur(8px); animation: labelFloat 4s ease-in-out infinite; }
    .label-web { top: 72px; left: 12px; } .label-apps { top: 125px; right: -2px; animation-delay: .7s; } .label-cloud { bottom: 88px; left: -5px; animation-delay: 1.2s; } .label-growth { bottom: 115px; right: -2px; border-color: rgba(83,200,255,.7); animation-delay: 1.8s; }
    @keyframes globeFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
    @keyframes globeSpin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
    @keyframes gridSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes orbitRotate { from { rotate: 0deg; } to { rotate: 360deg; } }
    @keyframes nodePulse { 0%,100% { scale: 1; opacity: .65; } 50% { scale: 1.8; opacity: 1; } }
    @keyframes labelFloat { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }
    @media (max-width: 900px) { .live-globe-wrap { flex-basis: auto; width: 100%; max-width: 500px; height: 390px; } .live-globe { transform: scale(.82); } }
    @media (prefers-reduced-motion: reduce) { .live-globe, .globe-core, .globe-grid, .globe-orbit, .globe-node, .globe-label { animation: none !important; } }
  `;
  document.head.appendChild(globeStyles);
}

const currentYear = document.getElementById('currentYear');
if (currentYear) currentYear.textContent = new Date().getFullYear();
