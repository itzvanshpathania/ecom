// cart-page.js
// Handles rendering cart items, quantity updates, and removal.

document.addEventListener("DOMContentLoaded", () => {
  initCartPage();
});

function initCartPage() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  renderCart();

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (!getCart().length) {
        showToast("Your cart is empty.");
        return;
      }
      window.location.href = "checkout.html";
    });
  }
}

function renderCart() {
  const itemsContainer = document.getElementById("cart-items");
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryTax = document.getElementById("summary-tax");
  const summaryTotal = document.getElementById("summary-total");

  const cart = getCart();
  itemsContainer.innerHTML = "";

  if (!cart.length) {
    itemsContainer.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
    if (summarySubtotal) summarySubtotal.textContent = formatPrice(0);
    if (summaryTax) summaryTax.textContent = formatPrice(0);
    if (summaryTotal) summaryTotal.textContent = formatPrice(0);
    return;
  }

  cart.forEach((item) => {
    const product = getProductById(item.productId);
    if (!product) return;

    const row = document.createElement("article");
    row.className = "cart-item";

    row.innerHTML = `
      <div class="cart-item__info">
        <img class="cart-item__image" src="${product.image}" alt="${product.name}" />
        <div>
          <h3 class="cart-item__title">${product.name}</h3>
          <p class="cart-item__price">${formatPrice(product.price)}</p>
        </div>
      </div>
      <div class="cart-item__controls">
        <input
          type="number"
          class="cart-item__qty field__input"
          min="1"
          value="${item.quantity}"
        />
        <button class="btn-link cart-item__remove">Remove</button>
      </div>
      <div class="cart-item__total">
        ${formatPrice(product.price * item.quantity)}
      </div>
    `;

    const qtyInput = row.querySelector(".cart-item__qty");
    const removeBtn = row.querySelector(".cart-item__remove");
    const lineTotalEl = row.querySelector(".cart-item__total");

    qtyInput.addEventListener("change", () => {
      let newQty = parseInt(qtyInput.value, 10);
      if (isNaN(newQty) || newQty <= 0) {
        newQty = 1;
        qtyInput.value = "1";
      }
      updateCartItem(product.id, newQty);
      lineTotalEl.textContent = formatPrice(product.price * newQty);
      updateSummary();
    });

    removeBtn.addEventListener("click", () => {
      removeFromCart(product.id);
      row.remove();
      renderCart();
      showToast("Item removed");
    });

    itemsContainer.appendChild(row);
  });

  updateSummary();
}

function updateSummary() {
  const { subtotal, tax, total } = calculateCartTotals();
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryTax = document.getElementById("summary-tax");
  const summaryTotal = document.getElementById("summary-total");

  if (summarySubtotal) summarySubtotal.textContent = formatPrice(subtotal);
  if (summaryTax) summaryTax.textContent = formatPrice(tax);
  if (summaryTotal) summaryTotal.textContent = formatPrice(total);
}