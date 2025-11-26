// Product data (id, name, price, emoji used as image placeholder, category, description)
const products = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: 1999,
    image: "🎧",
    category: "Electronics",
    description:
      "Compact, true wireless earbuds with noise isolation and 20‑hour battery life."
  },
  {
    id: 2,
    name: "Smartwatch Pro",
    price: 3499,
    image: "⌚",
    category: "Electronics",
    description:
      "Fitness tracking, notifications, and heart‑rate monitoring in a sleek design."
  },
  {
    id: 3,
    name: "Minimal Desk Lamp",
    price: 1299,
    image: "💡",
    category: "Home",
    description:
      "LED desk lamp with adjustable brightness for focused, eye‑friendly lighting."
  },
  {
    id: 4,
    name: "Ergonomic Chair",
    price: 5499,
    image: "🪑",
    category: "Home",
    description:
      "Ergonomic office chair with lumbar support for long working sessions."
  },
  {
    id: 5,
    name: "Classic Hoodie",
    price: 999,
    image: "🧥",
    category: "Apparel",
    description:
      "Soft, warm hoodie made with premium cotton blend for everyday comfort."
  },
  {
    id: 6,
    name: "Running Sneakers",
    price: 2299,
    image: "👟",
    category: "Apparel",
    description:
      "Lightweight sneakers designed to keep you comfortable and fast on your run."
  },
  {
    id: 7,
    name: "Ceramic Mug Set",
    price: 799,
    image: "☕",
    category: "Home",
    description:
      "Set of two handcrafted ceramic mugs, perfect for tea or coffee."
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    price: 1799,
    image: "🔊",
    category: "Electronics",
    description:
      "Portable speaker with deep bass and 10‑hour battery, great for music on the go."
  }
];

// Cart state (loaded from localStorage)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DOM references
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const productsGrid = document.getElementById("productsGrid");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartTaxEl = document.getElementById("cartTax");
const cartTotalEl = document.getElementById("cartTotal");
const productDetailSection = document.getElementById("product-detail");
const backToShopBtn = document.getElementById("backToShop");
const detailImage = document.getElementById("detailImage");
const detailTitle = document.getElementById("detailTitle");
const detailPrice = document.getElementById("detailPrice");
const detailDescription = document.getElementById("detailDescription");
const detailQty = document.getElementById("detailQty");
const detailAddToCartBtn = document.getElementById("detailAddToCart");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutMessage = document.getElementById("checkoutMessage");
const orderSummaryItems = document.getElementById("orderSummaryItems");
const orderSubtotalEl = document.getElementById("orderSubtotal");
const orderTaxEl = document.getElementById("orderTax");
const orderTotalEl = document.getElementById("orderTotal");
const contactForm = document.getElementById("contactForm");
const contactMessageStatus = document.getElementById("contactMessageStatus");

let currentDetailProduct = null;

/* ---------------- Navbar ---------------- */
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close mobile nav after click
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

/* ---------------- Shop / Products ---------------- */

// Build category filter options
function initCategories() {
  const categories = Array.from(new Set(products.map((p) => p.category)));
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// Render product cards based on filters
function renderProducts() {
  const category = categoryFilter.value;
  const search = searchInput.value.trim().toLowerCase();

  productsGrid.innerHTML = "";

  const filtered = products.filter((p) => {
    const matchCategory = category === "all" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search);
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    productsGrid.innerHTML =
      "<p style='color: var(--muted);'>No products found.</p>";
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">${product.image}</div>
      <h3 class="product-title">${product.name}</h3>
      <div class="product-category">${product.category}</div>
      <div class="product-price">₹${product.price.toFixed(2)}</div>
      <p class="product-desc">${product.description.slice(0, 70)}...</p>
      <div class="product-card-actions">
        <button class="btn btn-primary" data-id="${product.id}">
          Add to Cart
        </button>
        <button class="btn btn-link" data-detail="${product.id}">
          View
        </button>
      </div>
    `;

    productsGrid.appendChild(card);
  });

  // Attach listeners for the new buttons
  productsGrid.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      addToCart(id, 1);
    });
  });

  productsGrid.querySelectorAll("[data-detail]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-detail"));
      showProductDetail(id);
    });
  });
}

// Show product detail section
function showProductDetail(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  currentDetailProduct = product;

  detailImage.src =
    "data:image/svg+xml," +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" rx="24" ry="24" fill="#020617"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="80">${product.image}</text></svg>`);
  detailTitle.textContent = product.name;
  detailPrice.textContent = `₹${product.price.toFixed(2)}`;
  detailDescription.textContent = product.description;
  detailQty.value = 1;

  productDetailSection.classList.remove("hidden");
  window.location.hash = "#product-detail";
}

// Hide detail and go back to shop
backToShopBtn.addEventListener("click", () => {
  productDetailSection.classList.add("hidden");
  window.location.hash = "#shop";
});

// Detail: add to cart
detailAddToCartBtn.addEventListener("click", () => {
  if (!currentDetailProduct) return;
  const qty = Math.max(1, Number(detailQty.value) || 1);
  addToCart(currentDetailProduct.id, qty);
});

/* ---------------- Cart logic ---------------- */

// Add product to cart (or increase quantity)
function addToCart(productId, quantity) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }

  saveCart();
  renderCart();
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

// Update quantity
function updateCartQuantity(productId, quantity) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.quantity = Math.max(1, quantity);
  saveCart();
  renderCart();
}

// Save to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Calculate totals
function calculateTotals() {
  let subtotal = 0;
  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });
  const tax = subtotal * 0.1; // 10% example
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

// Render cart items and summary
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      "<p style='color: var(--muted);'>Your cart is empty.</p>";
  } else {
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return;

      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div class="cart-item-image"></div>
        <div class="cart-item-info">
          <h4>${product.name}</h4>
          <p>₹${product.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-actions">
          <div>
            Qty:
            <input
              type="number"
              min="1"
              value="${item.quantity}"
              data-qty="${product.id}"
            />
          </div>
          <div>Item total: ₹${(product.price * item.quantity).toFixed(2)}</div>
          <button class="cart-remove" data-remove="${product.id}">
            Remove
          </button>
        </div>
      `;

      cartItemsContainer.appendChild(row);
    });
  }

  // Update cart count and totals
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = itemCount;

  const { subtotal, tax, total } = calculateTotals();
  cartSubtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  cartTaxEl.textContent = `₹${tax.toFixed(2)}`;
  cartTotalEl.textContent = `₹${total.toFixed(2)}`;

  // Bind quantity change and remove buttons
  cartItemsContainer.querySelectorAll("[data-qty]").forEach((input) => {
    input.addEventListener("change", () => {
      const id = Number(input.getAttribute("data-qty"));
      const qty = Math.max(1, Number(input.value) || 1);
      updateCartQuantity(id, qty);
    });
  });

  cartItemsContainer.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-remove"));
      removeFromCart(id);
    });
  });

  // Also update order summary on checkout
  renderOrderSummary();
}

/* ---------------- Order summary (checkout) ---------------- */

function renderOrderSummary() {
  orderSummaryItems.innerHTML = "";

  if (cart.length === 0) {
    orderSummaryItems.innerHTML =
      "<p style='color: var(--muted);'>No items in cart.</p>";
  } else {
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return;
      const line = document.createElement("div");
      line.className = "summary-row";
      line.innerHTML = `
        <span>${product.name} × ${item.quantity}</span>
        <span>₹${(product.price * item.quantity).toFixed(2)}</span>
      `;
      orderSummaryItems.appendChild(line);
    });
  }

  const { subtotal, tax, total } = calculateTotals();
  orderSubtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  orderTaxEl.textContent = `₹${tax.toFixed(2)}`;
  orderTotalEl.textContent = `₹${total.toFixed(2)}`;
}

/* ---------------- Forms validation ---------------- */

// Simple validation helper: ensure every input/select/textarea in the form is valid
function validateForm(form) {
  // HTML5 constraint validation
  if (!form.checkValidity()) {
    // Let browser show built-in messages
    form.reportValidity();
    return false;
  }
  return true;
}

// Checkout submit
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (cart.length === 0) {
    checkoutMessage.textContent = "Your cart is empty. Add items before checkout.";
    checkoutMessage.style.color = "#f97373";
    return;
  }

  if (!validateForm(checkoutForm)) {
    checkoutMessage.textContent = "Please fill all required fields correctly.";
    checkoutMessage.style.color = "#f97373";
    return;
  }

  // Simulate success
  checkoutMessage.textContent =
    "Order placed successfully! This is a demo, no payment processed.";
  checkoutMessage.style.color = "#22c55e";

  // Clear cart
  cart = [];
  saveCart();
  renderCart();

  // Optionally reset form
  checkoutForm.reset();
});

// Contact form submit
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateForm(contactForm)) {
    contactMessageStatus.textContent = "Please fill all fields correctly.";
    contactMessageStatus.style.color = "#f97373";
    return;
  }

  // Simulate send
  contactMessageStatus.textContent =
    "Message sent! We will get back to you soon (demo only).";
  contactMessageStatus.style.color = "#22c55e";

  contactForm.reset();
});

/* ---------------- Initialization ---------------- */

function init() {
  initCategories();
  renderProducts();
  renderCart();
}

init();
