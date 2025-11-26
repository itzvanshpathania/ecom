// home.js
// Renders a subset of featured products on the home page.

document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedProducts();
});

function renderFeaturedProducts() {
  const container = document.getElementById("featured-grid");
  if (!container || !Array.isArray(PRODUCTS)) return;

  // For demo: take first 4 products as "featured"
  const featured = PRODUCTS.slice(0, 4);

  container.innerHTML = "";
  featured.forEach((product) => {
    const card = createHomeProductCard(product);
    container.appendChild(card);
  });
}

function createHomeProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  card.innerHTML = `
    <a href="product.html?id=${encodeURIComponent(
      product.id
    )}" class="product-card__image-wrapper">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
    </a>
    <div class="product-card__body">
      <h3 class="product-card__title">${product.name}</h3>
      <p class="product-card__category">${product.category}</p>
      <p class="product-card__price">${formatPrice(product.price)}</p>
      <button class="btn btn-primary product-card__btn" data-product-id="${product.id}">
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