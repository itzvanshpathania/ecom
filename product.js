// product.js
// Renders product details and handles "Add to Cart" on product.html.

document.addEventListener("DOMContentLoaded", () => {
  initProductPage();
});

function initProductPage() {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = productId ? getProductById(productId) : null;

  if (!product) {
    container.innerHTML = '<p class="empty-state">Product not found.</p>';
    return;
  }

  renderProductDetail(container, product);
}

function renderProductDetail(container, product) {
  container.innerHTML = `
    <div class="product-detail__image">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div class="product-detail__info">
      <h1 class="product-detail__title">${product.name}</h1>
      <p class="product-detail__price">${formatPrice(product.price)}</p>
      <p class="product-detail__category">${product.category}</p>
      <p class="product-detail__description">${product.description}</p>

      <div class="product-detail__actions">
        <div class="field">
          <label class="field__label" for="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            class="field__input"
            min="1"
            value="1"
          />
        </div>
        <button id="add-to-cart-btn" class="btn btn-primary btn-lg">
          Add to Cart
        </button>
      </div>
    </div>
  `;

  const addBtn = document.getElementById("add-to-cart-btn");
  const qtyInput = document.getElementById("quantity");

  addBtn.addEventListener("click", () => {
    const qty = parseInt(qtyInput.value, 10);
    if (isNaN(qty) || qty <= 0) {
      showToast("Please enter a valid quantity.");
      return;
    }
    addToCart(product.id, qty);
    showToast("Added to cart");
  });
}