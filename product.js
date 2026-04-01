let cart = [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    updateCount();
    renderCart();
}

function updateCount() {
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = cart.length;
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.style.right = '20px';
    setTimeout(() => {
        toast.style.right = '-300px';
    }, 2000);
}

function addToCart(id, name, price, img) {
    cart.push({ id, name, price, img, cartId: Date.now() });
    saveCart();
    updateCount();
    showToast(`${name} added!`);
    renderCart();
    showCart();
}

function removeItem(cid) {
    cart = cart.filter(i => i.cartId !== cid);
    saveCart();
    updateCount();
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('summary-subtotal').innerText = '$0.00';
        document.getElementById('summary-total').innerText = '$0.00';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item" style="display:flex;align-items:center;margin-bottom:15px;">
            <img src="${item.img}" alt="${item.name}" style="width:50px;height:50px;margin-right:10px;"/>
            <div style="flex:1;">${item.name}</div>
            <div style="width:80px;">$${item.price.toFixed(2)}</div>
            <button onclick="removeItem(${item.cartId})">Remove</button>
        </div>
    `).join('');

    const sub = cart.reduce((a, b) => a + b.price, 0);
    document.getElementById('summary-subtotal').innerText = `$${sub.toFixed(2)}`;
    document.getElementById('summary-total').innerText = `$${sub.toFixed(2)}`;
}

function showCart() {
    document.getElementById('view-cart').style.display = 'block';
}

function showHome() {
    document.getElementById('view-cart').style.display = 'none';
}

// initialise
window.addEventListener('DOMContentLoaded', () => {
    loadCart();
});