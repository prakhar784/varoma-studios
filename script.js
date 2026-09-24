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
  <p class="pricing-note">Starting price. Final quote depends on project requirements.</p>
  <button class="pricing-terms-link" type="button" id="pricingTermsButton">View Terms & Conditions →</button>
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
  .pricing-note { margin: 28px auto 8px; text-align: center; color: #9e9eb8; font-size: 13px; }
  .pricing-terms-link { display: block; margin: 0 auto; border: 0; background: transparent; color: #a995ff; font: inherit; font-size: 13px; cursor: pointer; padding: 8px 12px; transition: color .2s ease; }
  .pricing-terms-link:hover { color: #53c8ff; }
  .pricing-terms-modal { position: fixed; inset: 0; z-index: 9999; display: none; align-items: center; justify-content: center; padding: 20px; background: rgba(3,3,10,.78); backdrop-filter: blur(8px); }
  .pricing-terms-modal.open { display: flex; }
  .pricing-terms-box { position: relative; width: min(620px, 100%); max-height: min(680px, 88vh); overflow: auto; padding: 34px; border: 1px solid #3b3565; border-radius: 22px; background: linear-gradient(155deg,#1e1b3a,#0f0f1f); box-shadow: 0 25px 80px rgba(0,0,0,.5); }
  .pricing-terms-box h3 { margin: 0 42px 8px 0; font-size: 25px; }
  .pricing-terms-box > p { color: #aaaac0; line-height: 1.6; margin-bottom: 20px; }
  .pricing-terms-list { margin: 0; padding-left: 20px; color: #d2d1df; line-height: 1.7; }
  .pricing-terms-list li { margin-bottom: 12px; }
  .pricing-terms-close { position: absolute; top: 16px; right: 18px; width: 36px; height: 36px; border: 1px solid #3b3565; border-radius: 50%; background: #121225; color: #fff; font-size: 20px; cursor: pointer; }
  @media (max-width: 1100px) { .pricing-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 600px) { .pricing-section { padding: 75px 6%; } .pricing-grid { grid-template-columns: 1fr; } .pricing-card { min-height: 320px; } .pricing-terms-box { padding: 28px 22px; } }
`;
document.head.appendChild(pricingStyles);

const pricingTermsModal = document.createElement('div');
pricingTermsModal.className = 'pricing-terms-modal';
pricingTermsModal.id = 'pricingTermsModal';
pricingTermsModal.setAttribute('role', 'dialog');
pricingTermsModal.setAttribute('aria-modal', 'true');
pricingTermsModal.setAttribute('aria-labelledby', 'pricingTermsTitle');
pricingTermsModal.innerHTML = `
  <div class="pricing-terms-box">
    <button class="pricing-terms-close" type="button" id="pricingTermsClose" aria-label="Close terms and conditions">×</button>
    <h3 id="pricingTermsTitle">Pricing Terms & Conditions</h3>
    <p>Our displayed prices are starting prices. Your final quote will be confirmed after we understand your project requirements.</p>
    <ol class="pricing-terms-list">
      <li>Displayed prices are starting prices; the final quote depends on the agreed project scope and requirements.</li>
      <li>Domain, hosting and paid third-party services may be charged separately when required.</li>
      <li>Additional features or major changes outside the agreed scope may be quoted separately.</li>
      <li>Project timelines depend on requirements and timely delivery of necessary content or information.</li>
      <li>Payment, delivery, revisions and support will follow the final quotation agreed with the customer.</li>
    </ol>
  </div>
`;
document.body.appendChild(pricingTermsModal);

const pricingTermsButton = document.getElementById('pricingTermsButton');
const pricingTermsClose = document.getElementById('pricingTermsClose');
const closePricingTerms = () => pricingTermsModal.classList.remove('open');

if (pricingTermsButton) pricingTermsButton.addEventListener('click', () => pricingTermsModal.classList.add('open'));
if (pricingTermsClose) pricingTermsClose.addEventListener('click', closePricingTerms);
pricingTermsModal.addEventListener('click', (event) => {
  if (event.target === pricingTermsModal) closePricingTerms();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePricingTerms();
});

const contactVisual = document.createElement('div');
contactVisual.className = 'contact-visual';
contactVisual.setAttribute('aria-label', 'Animated digital workspace showing website, app, cloud and growth services');
contactVisual.innerHTML = `
  <div class="contact-orbit orbit-a"></div>
  <div class="contact-orbit orbit-b"></div>
  <div class="contact-orbit orbit-c"></div>
  <div class="contact-laptop">
    <div class="laptop-screen"><span>V</span><strong>IDEAS INTO<br>IMPACT</strong><i></i></div>
    <div class="laptop-base"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
  </div>
  <div class="contact-chip chip-code">&lt;/&gt;<small>Web</small></div>
  <div class="contact-chip chip-app">▯<small>Apps</small></div>
  <div class="contact-chip chip-cloud">⌁<small>Cloud</small></div>
  <div class="contact-chip chip-growth">▥<small>Growth</small></div>
  <div class="contact-chip chip-design">✦<small>Design</small></div>
  <div class="contact-chip chip-custom">⚙<small>Custom</small></div>
  <div class="contact-stars">✦　·　✧　·　✦</div>
`;

if (contactSection) {
  const contactHeading = contactSection.querySelector('.section-heading');
  if (contactHeading && !contactSection.querySelector('.contact-visual')) contactHeading.insertAdjacentElement('afterend', contactVisual);
}

const contactStyles = document.createElement('style');
contactStyles.textContent = `
  .contact-section { display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, 1fr); align-items: center; column-gap: 55px; row-gap: 20px; }
  .contact-section > .section-heading { grid-column: 1; grid-row: 1; margin-bottom: 0; }
  .contact-section > .contact-visual { grid-column: 2; grid-row: 1; }
  .contact-section > .contact-form { grid-column: 1 / -1; grid-row: 2; width: 100%; max-width: 900px; }
  .contact-visual { position: relative; min-height: 430px; width: 100%; display: grid; place-items: center; isolation: isolate; }
  .contact-visual::before { content: ''; position: absolute; width: 290px; height: 290px; border-radius: 50%; background: radial-gradient(circle, rgba(115,87,255,.32), rgba(83,200,255,.08) 52%, transparent 72%); filter: blur(14px); animation: contactGlow 5s ease-in-out infinite; }
  .contact-laptop { position: relative; width: 245px; height: 175px; transform: perspective(700px) rotateX(12deg) rotateY(-18deg) rotateZ(-4deg); animation: laptopFloat 5s ease-in-out infinite; filter: drop-shadow(0 22px 25px rgba(0,0,0,.5)); z-index: 3; }
  .laptop-screen { position: absolute; inset: 0 18px 28px; border: 7px solid #34306b; border-radius: 12px 12px 5px 5px; background: linear-gradient(145deg, #10132d, #1d1850 60%, #080812); box-shadow: inset 0 0 24px rgba(83,200,255,.18), 0 0 18px rgba(115,87,255,.32); display: grid; place-items: center; text-align: center; overflow: hidden; }
  .laptop-screen::after { content: ''; position: absolute; inset: 12px; border: 1px solid rgba(83,200,255,.35); border-radius: 4px; }
  .laptop-screen span { color: #53c8ff; font-size: 38px; font-weight: 900; font-style: italic; z-index: 1; }
  .laptop-screen strong { color: #fff; font-size: 13px; line-height: 1.25; letter-spacing: 1px; z-index: 1; }
  .laptop-screen i { position: absolute; width: 180%; height: 2px; background: #53c8ff; box-shadow: 0 0 16px #53c8ff; transform: rotate(-25deg); animation: scanLine 3.5s linear infinite; }
  .laptop-base { position: absolute; left: 0; right: 0; bottom: 0; height: 42px; border-radius: 5px 5px 18px 18px; background: linear-gradient(145deg, #6f61d6, #24244e 55%, #101022); border: 1px solid #7f76e8; display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; padding: 9px 24px 12px; transform: skewX(-8deg); }
  .laptop-base span { border-radius: 2px; background: rgba(180,185,255,.5); }
  .contact-orbit { position: absolute; width: 360px; height: 125px; border: 1px solid rgba(83,200,255,.5); border-radius: 50%; z-index: 1; }
  .orbit-a { transform: rotate(24deg); animation: contactOrbit 12s linear infinite; }
  .orbit-b { transform: rotate(-35deg) scaleY(.8); border-color: rgba(169,149,255,.65); animation: contactOrbit 16s linear infinite reverse; }
  .orbit-c { transform: rotate(90deg) scaleY(.7); border-color: rgba(115,87,255,.55); animation: contactOrbit 20s linear infinite; }
  .contact-chip { position: absolute; z-index: 4; width: 70px; min-height: 58px; padding: 8px 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: #fff; border: 1px solid rgba(140,120,255,.75); border-radius: 12px; background: rgba(24,20,61,.92); box-shadow: 0 0 22px rgba(115,87,255,.22); backdrop-filter: blur(8px); font-size: 23px; animation: chipFloat 4s ease-in-out infinite; }
  .contact-chip small { font-size: 10px; color: #d5d2ff; letter-spacing: .3px; }
  .chip-code { top: 42px; left: 7%; } .chip-app { top: 130px; left: -1%; animation-delay: .6s; } .chip-cloud { bottom: 62px; left: 9%; animation-delay: 1.2s; } .chip-growth { top: 66px; right: 5%; animation-delay: 1.8s; } .chip-design { top: 190px; right: -1%; animation-delay: 2.4s; } .chip-custom { bottom: 54px; right: 9%; animation-delay: 3s; }
  .contact-stars { position: absolute; bottom: 14px; color: #a995ff; font-size: 12px; letter-spacing: 4px; animation: starPulse 3s ease-in-out infinite; }
  @keyframes contactGlow { 0%,100% { transform: scale(.92); opacity: .65; } 50% { transform: scale(1.08); opacity: 1; } }
  @keyframes laptopFloat { 0%,100% { translate: 0 0; } 50% { translate: 0 -12px; } }
  @keyframes scanLine { from { translate: -100px -100px; } to { translate: 100px 100px; } }
  @keyframes contactOrbit { from { rotate: 0deg; } to { rotate: 360deg; } }
  @keyframes chipFloat { 0%,100% { translate: 0 0; } 50% { translate: 0 -9px; } }
  @keyframes starPulse { 0%,100% { opacity: .4; } 50% { opacity: 1; } }
  @media (max-width: 900px) { .contact-section { display: block; } .contact-section > .section-heading { margin-bottom: 35px; } .contact-visual { min-height: 350px; margin-bottom: 30px; } .contact-section > .contact-form { max-width: 650px; } }
  @media (max-width: 600px) { .contact-visual { transform: scale(.88); transform-origin: center; min-height: 320px; margin-block: -12px; } }
  @media (prefers-reduced-motion: reduce) { .contact-visual *, .contact-visual::before { animation: none !important; } }
`;
document.head.appendChild(contactStyles);

const currentYear = document.getElementById('currentYear');
if (currentYear) currentYear.textContent = new Date().getFullYear();
/* =========================
   INTERACTION ENHANCEMENTS
========================= */

const nav = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');

if (nav && navLinks) {
  const menuButton = document.createElement('button');
  menuButton.type = 'button';
  menuButton.className = 'mobile-menu-button';
  menuButton.setAttribute('aria-label', 'Open navigation menu');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.innerHTML = '<span></span><span></span><span></span>';

  const menuStyles = document.createElement('style');
  menuStyles.textContent = `
    .mobile-menu-button{display:none;width:44px;height:42px;border:1px solid #34344c;background:#121224;border-radius:10px;padding:9px;cursor:pointer}
    .mobile-menu-button span{display:block;height:2px;background:#fff;margin:5px 0;border-radius:4px;transition:.25s}
    .nav-links.mobile-open{display:flex}
    @media(max-width:900px){
      .navbar{position:relative}
      .mobile-menu-button{display:block}
      .navbar>.nav-button{display:none}
      .nav-links.mobile-open{position:absolute;top:70px;left:0;right:0;display:flex;flex-direction:column;gap:0;padding:10px;background:#111122;border:1px solid #292943;border-radius:14px;box-shadow:0 20px 45px #0008;z-index:20}
      .nav-links.mobile-open a{padding:13px 14px;border-radius:9px}
      .nav-links.mobile-open a:hover{background:#7357ff18}
    }
  `;
  document.head.appendChild(menuStyles);
  nav.insertBefore(menuButton, navLinks);

  menuButton.addEventListener('click', () => {
    const open = navLinks.classList.toggle('mobile-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Service cards pre-select the requested service in the real contact form. */
document.querySelectorAll('.service-card a[href="#contact"]').forEach(link => {
  link.addEventListener('click', () => {
    const title = link.closest('.service-card')?.querySelector('h3')?.textContent?.trim() || '';
    const service = document.getElementById('service');
    if (!service) return;
    const map = {
      'Web Development': 'Website',
      'App Development': 'App',
      'UI/UX Design': 'Design'
    };
    if (map[title]) service.value = map[title];
  });
});

/* Pricing buttons also pre-select the closest matching service. */
document.querySelectorAll('.pricing-card a[href="#contact"]').forEach(link => {
  link.addEventListener('click', () => {
    const title = link.closest('.pricing-card')?.querySelector('h3')?.textContent?.trim() || '';
    const service = document.getElementById('service');
    if (!service) return;
    if (/app/i.test(title)) service.value = 'App';
    else if (/design/i.test(title)) service.value = 'Design';
    else if (/ai/i.test(title)) service.value = 'AI';
    else service.value = 'Website';
  });
});

/* Keep all internal page navigation smooth and accessible. */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
