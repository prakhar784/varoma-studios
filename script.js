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
  const businessEmail = "varomastudios@gmail.com";
  window.location.href = `mailto:${businessEmail}?subject=${subject}&body=${body}`;

  formMessage.textContent =
    "Your email app is opening to send your inquiry to Varoma Studios.";
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
  const subject = encodeURIComponent(`New Varoma Studios Project Order — ${document.getElementById("orderType").value}`);
  const body = encodeURIComponent(summary);
  window.location.href = `mailto:varomastudios@gmail.com?subject=${subject}&body=${body}`;
  try {
    await navigator.clipboard.writeText(summary);
    orderResult.innerHTML = `<strong>Order prepared!</strong><br>Your email app is opening, and the order details have also been copied.`;
  } catch (error) {
    orderResult.innerHTML = `<strong>Order prepared!</strong><br>Your email app is opening to send the order to Varoma Studios.<br><textarea class="summary-box" readonly>${summary.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</textarea>`;
  }
  orderResult.classList.add("show");
});

clearOrder.addEventListener("click", () => {
  orderForm.reset();
  orderResult.textContent = "";
  orderResult.classList.remove("show");
});
