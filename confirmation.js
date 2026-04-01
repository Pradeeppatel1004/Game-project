const confirmationItems = document.getElementById("confirmationItems");
const orderIdElement = document.getElementById("orderId");
const orderTotalElement = document.getElementById("orderTotal");
const cartCount = document.getElementById("cart-count");

const order = JSON.parse(localStorage.getItem("latestOrder")) || null;

if (order) {
  orderIdElement.textContent = order.id;
  orderTotalElement.textContent = `$${order.total.toFixed(2)}`;

  order.items.forEach(item => {
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
      <div class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
    `;
    confirmationItems.appendChild(itemEl);
  });
}

const cart = JSON.parse(localStorage.getItem("urbanCart")) || [];
if (cartCount) {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}
