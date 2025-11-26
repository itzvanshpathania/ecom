// main.js
// Shared behaviors: mobile nav, toast notifications, footer year, contact form.

document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
  setYear();
  setupContactFormValidation();
});

// Mobile nav toggle
function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("nav-menu--open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("nav-menu--open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Footer year
function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// Simple toast utility used across pages
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("toast--visible");
  setTimeout(() => {
    toast.classList.remove("toast--visible");
  }, 2200);
}

// Contact form client-side validation + Formspree submit
function setupContactFormValidation() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("contact-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // we'll send via fetch

    if (status) {
      status.textContent = "";
      status.className = "form-status";
    }

    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const message = form.elements["message"].value.trim();

    const errors = [];
    if (!name) errors.push("Name is required.");
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      errors.push("A valid email is required.");
    }
    if (!message) errors.push("Message is required.");

    if (errors.length) {
      if (status) {
        status.textContent = errors.join(" ");
        status.classList.add("form-status--error");
      } else {
        alert(errors.join("\n"));
      }
      return;
    }

    try {
      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        if (status) {
          status.textContent = "Message sent! We will get back to you shortly.";
          status.classList.add("form-status--success");
        }
        form.reset();
      } else {
        if (status) {
          status.textContent = "Something went wrong. Please try again.";
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