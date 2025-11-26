// shop.js
// Handles product rendering, category filters, and search on shop.html.

let currentCategory = "All";
let currentSearch = "";

document.addEventListener("DOMContentLoaded", () => {
  initShopPage();
});

function initShopPage() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  setupCategoryFilters();
  setupSearch();
  renderProducts(PRODUCTS);
}

function setupCategoryFilters() {
  const container = document.getElementById("category-filters");
  if (!container) return;

  const categories = getAllCategories();
  container.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "chip" + (category === currentCategory ? " chip--active" : "");
    button.textContent = category;
    button.dataset.category = category;

    button.addEventListener("click", () => {
      currentCategory = category;
      container.querySelectorAll("button").forEach((btn) => {
        btn.classList.toggle("chip--active", btn.dataset.category === category);
      });
      filterProducts();
    });

    container.appendChild(button);
  });
}

function setupSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;

  input.addEventListener("input", () => {
    currentSearch = input.value.toLowerCase();
    filterProducts();
  });
}

function filterProducts() {
  const filtered = PRODUCTS.filter((product) => {
    const matchesCategory =
      currentCategory === "All" || product.category === currentCategory;
    const matchesSearch =
      !currentSearch || product.name.toLowerCase().includes(currentSearch);
    return matchesCategory && matchesSearch;
  });

  renderProducts(filtered);
}

function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (!list.length) {
    grid.innerHTML = '<p class="empty-state">No products found.</p>';
    return;
  }

  list.forEach((product) => {
    const card = createShopProductCard(product);
    grid.appendChild(card);
  });
}

function createShopProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const shortDesc =
    product.description.length > 90
      ? product.description.slice(0, 87) + "..."
      : product.description;

  card.innerHTML = `
    <a href="product.html?id=${encodeURIComponent(
      product.id
    )}" class="product-card__image-wrapper">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
    </a>
    <div class="product-card__body">
      <h3 class="product-card__title">${product.name}</h3>
      <p class="product-card__description">${shortDesc}</p>
      <div class="product-card__meta">
        <span class="product-card__price">${formatPrice(product.price)}</span>
        <span class="product-card__category">${product.category}</span>
      </div>
      <button class="btn btn-secondary product-card__btn" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;

  const btn = card.querySelector("button");
  btn.addEventListener("click", () => {
    addToCart(product.id, 1);
    showToast("Added to cart");
  });

  return card;
}