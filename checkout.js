// checkout.js
// Renders order summary and validates the checkout form, then sends to Formspree.

document.addEventListener("DOMContentLoaded", () => {
  initCheckoutPage();
});

function initCheckoutPage() {
  const form = document.getElementById("checkout-form");
  const summaryContainer = document.getElementById("checkout-summary");
  if (!form || !summaryContainer) return;

  const cart = getCart();
  if (!cart.length) {
    summaryContainer.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
    const btn = form.querySelector("button[type='submit']");
    if (btn) btn.disabled = true;
    return;
  }

  renderCheckoutSummary(summaryContainer, cart);
  setupCheckoutValidation(form);
}

function renderCheckoutSummary(container, cart) {
  container.innerHTML = "";

  if (!cart.length) {
    container.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
    return;
  }

  const list = document.createElement("div");
  list.className = "checkout-summary__items";

  cart.forEach((item) => {
    const product = getProductById(item.productId);
    if (!product) return;

    const row = document.createElement("div");
    row.className = "checkout-summary__item";
    row.innerHTML = `
      <span>${product.name} × ${item.quantity}</span>
      <span>${formatPrice(product.price * item.quantity)}</span>
    `;
    list.appendChild(row);
  });

  const { subtotal, tax, total } = calculateCartTotals();

  const totals = document.createElement("div");
  totals.className = "checkout-summary__totals";
  totals.innerHTML = `
    <div><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
    <div><span>Tax</span><span>${formatPrice(tax)}</span></div>
    <div class="checkout-summary__grand-total">
      <span>Total</span><span>${formatPrice(total)}</span>
    </div>
  `;

  container.appendChild(list);
  container.appendChild(totals);
}

// Validate checkout form and submit to Formspree
function setupCheckoutValidation(form) {
  const status = document.getElementById("checkout-status");
  const summaryContainer = document.getElementById("checkout-summary");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (status) {
      status.textContent = "";
      status.className = "form-status";
    }

    const data = {
      name: form.elements["name"].value.trim(),
      email: form.elements["email"].value.trim(),
      address: form.elements["address"].value.trim(),
      city: form.elements["city"].value.trim(),
      country: form.elements["country"].value.trim(),
      payment: form.elements["payment"].value.trim()
    };

    const errors = [];
    if (!data.name) errors.push("Name is required.");
    if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      errors.push("A valid email is required.");
    }
    if (!data.address) errors.push("Address is required.");
    if (!data.city) errors.push("City is required.");
    if (!data.country) errors.push("Country is required.");
    if (!data.payment) errors.push("Payment method is required.");

    const currentCart = getCart();
    if (!currentCart.length) {
      errors.push("Your cart is empty.");
    }

    if (errors.length) {
      if (status) {
        status.textContent = errors.join(" ");
        status.classList.add("form-status--error");
      } else {
        alert(errors.join("\n"));
      }
      return;
    }

    // Build order summary text to send to Formspree
    const orderLines = [];
    currentCart.forEach((item) => {
      const product = getProductById(item.productId);
      if (!product) return;
      orderLines.push(
        `${product.name} × ${item.quantity} = ${formatPrice(
          product.price * item.quantity
        )}`
      );
    });

    const { subtotal, tax, total } = calculateCartTotals();

    try {
      const formData = new FormData(form);
      formData.append("order_items", orderLines.join("\n"));
      formData.append("order_subtotal", subtotal.toFixed(2));
      formData.append("order_tax", tax.toFixed(2));
      formData.append("order_total", total.toFixed(2));

      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        // Clear cart locally and update summary UI
        clearCart();
        renderCheckoutSummary(summaryContainer, []);

        if (status) {
          status.textContent =
            "Order placed successfully! A confirmation email has been sent (via Formspree).";
          status.classList.add("form-status--success");
        }

        const btn = form.querySelector("button[type='submit']");
        if (btn) btn.disabled = true;

        form.reset();
      } else {
        if (status) {
          status.textContent = "Something went wrong placing your order. Please try again.";
          status.classList.add("form-status--error");
        }
      }
    } catch (err) {
      console.error(err);
      if (status) {
        status.textContent = "Network error. Please try again.";
        status.classList.add("form-status--error");
      }
    }
  });
}