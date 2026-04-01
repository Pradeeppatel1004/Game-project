const checkoutCart = JSON.parse(localStorage.getItem("urbanCart")) || [];
const cartCount = document.getElementById("cart-count");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutTax = document.getElementById("checkoutTax");
const checkoutTotal = document.getElementById("checkoutTotal");
const placeOrderButton = document.getElementById("placeOrderButton");
const stepItems = document.querySelectorAll(".checkout-steps .step");
const shippingSection = document.getElementById("shippingSection");
const paymentSection = document.getElementById("paymentSection");

function updateCartCount() {
  if (!cartCount) return;
  const totalQuantity = checkoutCart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;
}

function renderCheckoutSummary() {
  if (!checkoutItems) return;
  checkoutItems.innerHTML = "";
  let subtotal = 0;

  checkoutCart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemEl = document.createElement("div");
    itemEl.className = "summary-item";
    itemEl.innerHTML = `
      <div class="summary-item-thumb">
        <img src="${item.image || 'imges/Logo.png'}" alt="${item.title}" onerror="this.src='imges/Logo.png'">
      </div>
      <div class="summary-item-info">
        <p>${item.title}</p>
        <span>Qty: ${item.quantity}</span>
      </div>
      <div class="summary-item-price">$${itemTotal.toFixed(2)}</div>
    `;
    checkoutItems.appendChild(itemEl);
  });

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  checkoutTax.textContent = `$${tax.toFixed(2)}`;
  checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setStep(step) {
  const stepMap = {
    cart: { cart: 'step-complete', shipping: 'step-upcoming', payment: 'step-upcoming', confirmation: 'step-upcoming' },
    shipping: { cart: 'step-complete', shipping: 'step-active', payment: 'step-upcoming', confirmation: 'step-upcoming' },
    payment: { cart: 'step-complete', shipping: 'step-complete', payment: 'step-active', confirmation: 'step-upcoming' },
    confirmation: { cart: 'step-complete', shipping: 'step-complete', payment: 'step-complete', confirmation: 'step-active' }
  };

  stepItems.forEach(stepEl => {
    const current = stepEl.dataset.step;
    stepEl.classList.remove("step-complete", "step-active", "step-upcoming");
    stepEl.classList.add(stepMap[step][current]);
  });
}

function updateSteps() {
  const shippingTop = shippingSection.getBoundingClientRect().top;
  const paymentTop = paymentSection.getBoundingClientRect().top;

  if (paymentTop <= 150) {
    setStep('payment');
  } else if (shippingTop <= 150) {
    setStep('shipping');
  } else {
    setStep('cart');
  }
}

function validateSection(section) {
  const fields = {
    shipping: [
      document.getElementById("firstName"),
      document.getElementById("lastName"),
      document.getElementById("email"),
      document.getElementById("phone"),
      document.getElementById("address"),
      document.getElementById("city"),
      document.getElementById("state"),
      document.getElementById("zip")
    ],
    payment: [
      document.getElementById("cardName"),
      document.getElementById("cardNumber"),
      document.getElementById("expiry"),
      document.getElementById("cvv")
    ]
  };

  let valid = true;
  fields[section].forEach(input => {
    if (!input.value.trim()) {
      input.classList.add("input-error");
      valid = false;
    } else {
      input.classList.remove("input-error");
    }
  });

  return valid;
}

function placeOrder() {
  if (!validateSection('shipping') || !validateSection('payment')) {
    alert("Please complete all required fields before placing your order.");
    return;
  }

  const subtotal = checkoutCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const orderId = `UC-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;

  const order = {
    id: orderId,
    items: checkoutCart,
    subtotal,
    tax,
    total,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem("latestOrder", JSON.stringify(order));
  placeOrderButton.textContent = "Processing...";
  placeOrderButton.disabled = true;

  setTimeout(() => {
    localStorage.removeItem("urbanCart");
    window.location.href = "confirmation.html";
  }, 1200);
}

if (stepItems) {
  stepItems.forEach(step => {
    step.addEventListener("click", () => {
      const target = step.dataset.step;
      if (target === "shipping") scrollToSection("shippingSection");
      if (target === "payment") scrollToSection("paymentSection");
    });
  });
}

window.addEventListener("scroll", updateSteps);
placeOrderButton.addEventListener("click", placeOrder);
updateCartCount();
renderCheckoutSummary();
updateSteps();
