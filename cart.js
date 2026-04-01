const cart = JSON.parse(localStorage.getItem("urbanCart")) || [];
const cartItemsContainer = document.getElementById("cartItems");
const cartSummary = document.getElementById("cartSummary");
const emptyCartSection = document.getElementById("emptyCart");
const cartWrapper = document.getElementById("cartWrapper");
const cartCount = document.getElementById("cart-count");

function updateCartCount() {
  if (!cartCount) return;
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;
}

function saveCart() {
  localStorage.setItem("urbanCart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function changeQuantity(id, delta) {
  const item = cart.find(product => product.id === id);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart();
}

function removeItem(id) {
  const index = cart.findIndex(product => product.id === id);
  if (index === -1) return;
  cart.splice(index, 1);
  saveCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartWrapper.classList.add("hidden");
    emptyCartSection.classList.remove("hidden");
    return;
  }

  cartWrapper.classList.remove("hidden");
  emptyCartSection.classList.add("hidden");
  cartItemsContainer.innerHTML = "";

  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemRow = document.createElement("div");
    itemRow.className = "cart-item";
    itemRow.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image || 'imges/Logo.png'}" alt="${item.title}" onerror="this.src='imges/Logo.png'">
      </div>
      <div class="cart-item-details">
        <p class="cart-item-title">${item.title}</p>
        <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
        <div class="cart-actions-row">
          <div class="quantity-controller">
            <button onclick="changeQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
          <button class="remove-button" onclick="removeItem(${item.id})">Remove</button>
        </div>
      </div>
      <div class="cart-item-total">
        <span>$${itemTotal.toFixed(2)}</span>
      </div>
    `;

    cartItemsContainer.appendChild(itemRow);
  });

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  cartSummary.innerHTML = `
    <div class="summary-box">
      <h2>Order Summary</h2>
      <div class="summary-row">
        <span>Subtotal</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>FREE</span>
      </div>
      <div class="summary-row">
        <span>Estimated tax</span>
        <span>$${tax.toFixed(2)}</span>
      </div>
      <div class="summary-row total-row">
        <strong>Total</strong>
        <strong>$${total.toFixed(2)}</strong>
      </div>
      <button class="checkout-button" onclick="window.location.href='checkout.html'">Proceed to Checkout</button>
      <button class="button continue-button" onclick="window.location.href='index.html'">Continue Shopping</button>
    </div>
  `;
}

updateCartCount();
renderCart();
