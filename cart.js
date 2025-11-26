// cart.js
// Encapsulates cart operations and price calculations.

const CART_KEY = "modern_store_cart";
const TAX_RATE = 0.07; // 7% demo tax

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
}

function updateCartItem(productId, quantity) {
  let cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;

  if (quantity <= 0) {
    cart = cart.filter((i) => i.productId !== productId);
  } else {
    item.quantity = quantity;
  }
  saveCart(cart);
}

function getCartItemCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function calculateCartTotals() {
  const cart = getCart();
  let subtotal = 0;
  cart.forEach((item) => {
    const product = getProductById(item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

// Format as currency (simple)
function formatPrice(value) {
  return "$" + value.toFixed(2);
}

// Update badge in navbar; safe if element doesn't exist.
function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  el.textContent = getCartItemCount();
}