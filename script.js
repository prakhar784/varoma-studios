const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((element) => observer.observe(element));

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value.trim();

  const subject = encodeURIComponent(`Varoma Studios Inquiry — ${service}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject Details:\n${message}`
  );

  // Replace this address with your official Varoma Studios email.
  const businessEmail = "YOUR_EMAIL_HERE@example.com";
  window.location.href = `mailto:${businessEmail}?subject=${subject}&body=${body}`;

  formMessage.textContent =
    "Your email app is opening. Replace the business email in script.js before publishing.";
});

document.getElementById("year").textContent = new Date().getFullYear();


// Project order form: prepares a structured inquiry for review/copying.
const orderForm = document.getElementById("orderForm");
const orderResult = document.getElementById("orderResult");
const clearOrder = document.getElementById("clearOrder");

function buildOrderSummary() {
  const get = (id) => document.getElementById(id).value.trim();
  return `VAROMA STUDIOS — PROJECT ORDER\n\nName: ${get("orderName")}\nEmail: ${get("orderEmail")}\nPhone/WhatsApp: ${get("orderPhone")}\nProject Type: ${get("orderType")}\nBudget: ${get("orderBudget")}\nTimeline: ${get("orderTimeline")}\n\nRequirements:\n${get("orderDetails")}`;
}

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const summary = buildOrderSummary();
  try {
    await navigator.clipboard.writeText(summary);
    orderResult.innerHTML = `<strong>Order details prepared!</strong><br>They have been copied. Send them to Varoma Studios through your preferred channel.`;
  } catch (error) {
    orderResult.innerHTML = `<strong>Order details prepared!</strong><br><textarea class="summary-box" readonly>${summary.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</textarea>`;
  }
  orderResult.classList.add("show");
});

clearOrder.addEventListener("click", () => {
  orderForm.reset();
  orderResult.textContent = "";
  orderResult.classList.remove("show");
});
