// Global State
let data = [];
let filteredData = [];
let limit = 20;
let skip = 0;
let selectedCategory = "all";
let totalProducts = 0;
let cart = JSON.parse(localStorage.getItem('urbanCart')) || []; // Persist cart between pages

// DOM Elements
const productsContainer = document.getElementById("product");
const cartCountElement = document.getElementById("cart-count");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

// ===============================
// 1. NAVIGATION & VIEW LOGIC
// ===============================

function showHome() {
    // If on cart.html, this redirects to index
    if (!document.getElementById('view-home')) {
        window.location.href = "index.html";
        return;
    }
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-home').classList.add('active');
    if(document.getElementById('sidebar')) document.getElementById('sidebar').style.display = 'none';
    window.scrollTo(0,0);
}

// REMOVE your old showCart()
// ADD this version:
function showCart() {
    if (!document.getElementById('view-cart')) {
        // We are on index.html, so go to cart.html
        window.location.href = "cart.html";
    } else {
        // We are already on cart.html, just switch the view
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('view-cart').classList.add('active');
        updateUI();
        window.scrollTo(0,0);
    }
}

function goToCheckout() {
    if (cart.length === 0) return alert("Your cart is empty!");
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-checkout').classList.add('active');
    document.getElementById('checkout-stepper').style.display = 'flex';
    
    // Sidebar adjustments for checkout
    document.getElementById('checkout-thumbnails').style.display = 'block';
    document.getElementById('promo-wrapper').style.display = 'none';
    document.getElementById('proceed-btn').style.display = 'none';
    window.scrollTo(0,0);
}

function finalizeOrder() {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-success').classList.add('active');
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('step-confirm').classList.add('active');
    cart = [];
    saveCart();
    updateCartCount();
    window.scrollTo(0,0);
}

// ===============================
// 2. ADD TO CART LOGIC
// ===============================

function addToCart(id, title, price, img) {
    let existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: id,
            title: title,
            price: price,
            img: img,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showToast(`${title} added to cart!`);
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    updateUI(); 
}

function saveCart() {
    localStorage.setItem('urbanCart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if(cartCountElement) cartCountElement.innerText = totalItems;
}

// ===============================
// 3. UI UPDATES (SIDEBAR & LISTS)
// ===============================

function updateUI() {
    const emptyMsg = document.getElementById('empty-cart-msg');
    const cartList = document.getElementById('cart-list');
    const sidebar = document.getElementById('sidebar');
    const thumbList = document.getElementById('checkout-thumbnails');

    if (!cartList) return; // Exit if not on the cart page

    if (cart.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
        cartList.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
    } else {
        if (emptyMsg) emptyMsg.style.display = 'none';
        cartList.style.display = 'block';
        if (sidebar) sidebar.style.display = 'block';
    }

    // Render Shopping Cart Items
    cartList.innerHTML = cart.map(item => `
        <div class="cart-item" style="display:flex; align-items:center; gap:20px; padding:15px; border-bottom:1px solid #eee;">
            <img src="${item.img}" style="width:80px; height:80px; object-fit:cover; border-radius:8px;">
            <div style="flex:1;">
                <h4 style="margin:0;">${item.title}</h4>
                <p style="color:#666; margin:5px 0;">Qty: ${item.quantity}</p>
                <span style="color:red; cursor:pointer; font-size:0.9rem;" onclick="removeItem(${item.id})">Remove</span>
            </div>
            <div style="font-weight:bold;">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    // Update Sidebar Thumbnails for Checkout View
    if (thumbList) {
        thumbList.innerHTML = cart.map(item => `
            <div class="side-thumb" style="display:flex; gap:10px; margin-bottom:10px;">
                <img src="${item.img}" style="width:40px; height:40px; border-radius:4px;">
                <div style="font-size:0.8rem;">${item.title} (x${item.quantity})</div>
            </div>
        `).join('');
    }

    // Calculations
    const sub = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
    const tax = sub * 0.08; 
    const total = sub + tax;

    if(document.getElementById('sub-total')) document.getElementById('sub-total').innerText = `$${sub.toFixed(2)}`;
    if(document.getElementById('tax-total')) document.getElementById('tax-total').innerText = `$${tax.toFixed(2)}`;
    if(document.getElementById('final-total')) document.getElementById('final-total').innerText = `$${total.toFixed(2)}`;
}

// ===============================
// 4. API FETCHING (For index.html)
// ===============================

function fetchProducts() {
    if (!productsContainer) return;

    let url = selectedCategory === "all"
        ? `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
        : `https://dummyjson.com/products/category/${selectedCategory}?limit=${limit}&skip=${skip}`;

    fetch(url)
        .then(res => res.json())
        .then(result => {
            totalProducts = result.total;
            data = [...data, ...result.products];
            filteredData = [...data];
            renderProducts(filteredData);
            skip += limit;
        });
}

function renderProducts(products) {
    if (!productsContainer) return;
    productsContainer.innerHTML = "";
    products.forEach(product => {
        const productItem = document.createElement("div");
        productItem.className = "productItems";
        const safeTitle = product.title.replace(/'/g, "\\'");
        
        productItem.innerHTML = `
            <div class="productimg"><img src="${product.images[0]}"></div>
            <h3 class="ProductCategories">${product.category.toUpperCase()}</h3>
            <p class="ProductName">${product.title}</p>
            <div class="Product-card_Rating"><span>★ ${product.rating}</span></div>
            <div class="Product-card_Cost"><span class="Cost2">$${product.price}</span></div>
            <div class="Product-cardButton">
                <button onclick="addToCart(${product.id}, '${safeTitle}', ${product.price}, '${product.images[0]}')">
                   Add to Cart
                </button>
            </div>
        `;
        productsContainer.appendChild(productItem);
    });
    const countText = document.getElementById("showCount");
    if(countText) countText.textContent = `Showing ${filteredData.length} of ${totalProducts} products`;
}

// ===============================
// 5. TOAST & INITIALIZATION
// ===============================

function showToast(msg) {
    const toast = document.getElementById('toast') || document.createElement('div');
    toast.style.cssText = "position:fixed; bottom:20px; right:20px; background:#333; color:white; padding:12px 20px; border-radius:8px; z-index:10000;";
    toast.innerText = msg;
    if (!document.getElementById('toast')) document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// Start
updateCartCount();
if (document.getElementById('product')) fetchProducts();
if (document.getElementById('cart-list')) updateUI();

// Event Listeners for search/sort on index.html
if (searchInput) {
    searchInput.addEventListener("keyup", () => {
        const value = searchInput.value.toLowerCase();
        filteredData = data.filter(p => p.title.toLowerCase().includes(value));
        renderProducts(filteredData);
    });
}
// ADD THIS AT THE BOTTOM OF product.js
window.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('view-cart')) {
        updateUI();
    }
});