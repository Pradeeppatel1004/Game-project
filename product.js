let data = [];
let filteredData = [];
let limit = 20;
let skip = 0;
let selectedCategory = "all";
let totalProducts = 0;
let cart = JSON.parse(localStorage.getItem("urbanCart")) || [];

const productsContainer = document.getElementById("product");
const filtersDiv = document.querySelector(".filters");
const loadMoreBtn = document.querySelector(".LoadButton");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const showCount = document.getElementById("showCount");
const cartCount = document.getElementById("cart-count");
const toastContainer = document.getElementById("toastContainer");

function updateCartCount() {
  if (!cartCount) return;
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;
}

function saveCart() {
  localStorage.setItem("urbanCart", JSON.stringify(cart));
  updateCartCount();
}

function showToast(message) {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerHTML = `
    <span>✅</span>
    <strong>${message}</strong>
    <button aria-label="Close">×</button>
  `;

  toast.querySelector("button").addEventListener("click", () => {
    toast.remove();
  });

  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function addToCart(id, title, price, image = "") {
  const existingProduct = cart.find(item => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id,
      title,
      price,
      image,
      quantity: 1
    });
  }

  saveCart();
  showToast(`${title} added to cart!`);
}

// ===============================
// FETCH PRODUCTS
// ===============================
function fetchProducts() {
  const url = selectedCategory === "all"
    ? `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
    : `https://dummyjson.com/products/category/${selectedCategory}?limit=${limit}&skip=${skip}`;

  fetch(url)
    .then(res => res.json())
    .then(result => {
      totalProducts = result.total;
      const products = result.products;

      data = [...data, ...products];
      filteredData = [...data];

      renderProducts(filteredData);
      skip += limit;
      updateShowingCount();
    })
    .catch(() => {
      productsContainer.innerHTML = "<p class='error-message'>Unable to load products. Please refresh.</p>";
    });
}

function renderProducts(products) {
  productsContainer.innerHTML = "";
  products.forEach(product => createItemCard(product));
  updateShowingCount();
}

function createItemCard(product) {
  const productItem = document.createElement("div");
  productItem.className = "productItems";

  const discount = Math.round(product.discountPercentage || 0);
  const originalPrice = discount > 0 ? (product.price / (1 - discount / 100)) : product.price;
  const ratingStars = "★".repeat(Math.round(product.rating)) + "☆".repeat(5 - Math.round(product.rating));

  productItem.innerHTML = `
    <div class="card-badges">
      <span class="badge category-badge">${product.category}</span>
      ${discount > 0 ? `<span class="badge discount-badge">-${discount}%</span>` : ""}
    </div>
    <div class="productimg">
      <img class="product-card__image" src="${product.images[0]}" alt="${product.title}">
    </div>
    <div class="product-card-content">
      <h3 class="ProductName">${product.title}</h3>
      <div class="Product-card_Rating">
        <span>${ratingStars}</span>
        <strong>${product.rating.toFixed(1)}</strong>
      </div>
      <div class="price-row">
        <span class="Cost1">$${product.price.toFixed(2)}</span>
        ${discount > 0 ? `<span class="Cost2">$${originalPrice.toFixed(2)}</span>` : ""}
      </div>
    </div>
    <div class="Product-cardButton">
      <button onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.images[0]}')">Add to Cart</button>
    </div>
  `;

  productsContainer.appendChild(productItem);
}

searchInput.addEventListener("keyup", () => {
  const value = searchInput.value.toLowerCase();
  filteredData = data.filter(product => product.title.toLowerCase().includes(value));
  renderProducts(filteredData);
});

sortSelect.addEventListener("change", () => {
  const value = sortSelect.value;

  if (value === "low") {
    filteredData.sort((a, b) => a.price - b.price);
  } else if (value === "high") {
    filteredData.sort((a, b) => b.price - a.price);
  } else if (value === "rating") {
    filteredData.sort((a, b) => b.rating - a.rating);
  } else if (value === "name") {
    filteredData.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filteredData = [...data];
  }

  renderProducts(filteredData);
});

function updateShowingCount() {
  showCount.textContent = `Showing ${filteredData.length} of ${totalProducts} products`;
}

function fetchCategories() {
  fetch("https://dummyjson.com/products/category-list")
    .then(res => res.json())
    .then(categories => {
      filtersDiv.innerHTML = "";

      const allBtn = document.createElement("button");
      allBtn.textContent = "All Products";
      allBtn.className = "filterButton active";
      allBtn.addEventListener("click", () => {
        selectedCategory = "all";
        resetProducts();
      });
      filtersDiv.appendChild(allBtn);

      categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category.toUpperCase();
        btn.className = "filterButton";
        btn.addEventListener("click", () => {
          selectedCategory = category;
          resetProducts();
        });
        filtersDiv.appendChild(btn);
      });
    })
    .catch(() => {
      filtersDiv.innerHTML = "<p class='error-message'>Unable to load categories.</p>";
    });
}

function resetProducts() {
  productsContainer.innerHTML = "";
  data = [];
  filteredData = [];
  skip = 0;
  fetchProducts();
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => fetchProducts());
}

updateCartCount();
fetchCategories();
fetchProducts();

