/* Hearth & Hem — shared interactions */
(function () {
  "use strict";

  /* ---- Mobile navigation ---- */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.getElementById("main-nav");

  function closeNav(returnFocus) {
    if (!navToggle || !mainNav) return;
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    if (returnFocus) navToggle.focus();
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
    mainNav.addEventListener("click", function (event) {
      if (event.target.closest("a") && window.matchMedia("(max-width: 55.99rem)").matches) closeNav(false);
    });
    mainNav.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mainNav.classList.contains("is-open")) closeNav(true);
    });
    document.addEventListener("click", function (event) {
      if (mainNav.classList.contains("is-open") && !mainNav.contains(event.target) && !navToggle.contains(event.target)) closeNav(false);
    });
    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 56rem)").matches) closeNav(false);
    });
  }

  /* ---- Theme toggle ---- */
  var themeToggle = document.querySelector(".theme-toggle");
  var root = document.documentElement;
  var STORAGE_KEY = "hh-theme";

  function applyTheme(theme) {
    root.toggleAttribute("data-theme", theme === "dark");
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
  var savedTheme = null;
  try { savedTheme = localStorage.getItem(STORAGE_KEY); } catch (err) { savedTheme = null; }
  applyTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (err) {}
    });
  }

  /* ---- Resilient image states ---- */
  document.querySelectorAll("img.product-photo, img.story-photo-img").forEach(function (img) {
    var frame = img.closest(".card-media, .hero-mark, .story-photo");
    if (!frame) return;
    function loaded() { frame.classList.add("is-loaded"); frame.classList.remove("is-error"); }
    function failed() {
      frame.classList.add("is-error");
      img.hidden = true;
      if (!frame.querySelector(".media-fallback")) {
        var fallback = document.createElement("div");
        fallback.className = "media-fallback";
        var alt = img.getAttribute("alt") || "Hearth & Hem piece";
        fallback.innerHTML = "<div><strong>Hearth &amp; Hem</strong><span>Image unavailable — product details remain available.</span></div>";
        fallback.setAttribute("role", "img");
        fallback.setAttribute("aria-label", alt + ". Product image unavailable.");
        frame.appendChild(fallback);
      }
    }
    img.addEventListener("load", loaded, { once: true });
    img.addEventListener("error", failed, { once: true });
    if (img.complete) img.naturalWidth ? loaded() : failed();
  });

  /* ---- Newsletter sign-up ---- */
  var newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    var newsletterInput = document.getElementById("newsletter-email");
    var newsletterMsg = document.getElementById("newsletter-msg");
    var submit = newsletterForm.querySelector("button[type=submit]");
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = newsletterInput.value.trim();
      newsletterMsg.className = "newsletter-msg";
      if (!pattern.test(value)) {
        newsletterMsg.textContent = "Enter a valid email address to subscribe.";
        newsletterInput.setAttribute("aria-invalid", "true");
        newsletterInput.focus();
        return;
      }
      newsletterInput.setAttribute("aria-invalid", "false");
      if (submit) { submit.disabled = true; submit.textContent = "Joining…"; }
      newsletterMsg.textContent = "";
      window.setTimeout(function () {
        newsletterMsg.textContent = "You're on the list — welcome to Hearth & Hem.";
        newsletterMsg.classList.add("success");
        newsletterForm.reset();
        if (submit) { submit.disabled = false; submit.textContent = "Subscribe"; }
      }, 450);
    });
  }
})();

/* ---- Responsive device preview ---- */
(function () {
  "use strict";
  var buttons = document.querySelectorAll("[data-preview-width]");
  if (!buttons.length) return;
  var activeDialog = null;
  var lastFocus = null;
  var page = window.location.pathname.split("/").pop() || "index.html";

  function closePreview() {
    if (!activeDialog) return;
    activeDialog.remove();
    activeDialog = null;
    if (lastFocus) lastFocus.focus();
  }

  function openPreview(width, label, sourceButton) {
    closePreview();
    lastFocus = sourceButton;
    var backdrop = document.createElement("div");
    backdrop.className = "device-preview-backdrop";
    backdrop.innerHTML = '' +
      '<section class="device-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="device-preview-title">' +
        '<div class="device-preview-toolbar">' +
          '<strong id="device-preview-title">Responsive preview</strong>' +
          '<div class="device-preview-options" role="group" aria-label="Preview size">' +
            '<button type="button" class="device-preview-option" data-size="390">Mobile</button>' +
            '<button type="button" class="device-preview-option" data-size="768">Tablet</button>' +
            '<button type="button" class="device-preview-option" data-size="1440">Desktop</button>' +
            '<span class="device-preview-size" aria-live="polite"></span>' +
            '<button type="button" class="device-preview-close" aria-label="Close responsive preview">Close</button>' +
          '</div>' +
        '</div>' +
        '<div class="device-preview-stage">' +
          '<div class="device-preview-frame"><iframe title="Responsive preview of this page"></iframe></div>' +
        '</div>' +
      '</section>';
    document.body.appendChild(backdrop);
    activeDialog = backdrop;
    var frame = backdrop.querySelector(".device-preview-frame");
    var iframe = backdrop.querySelector("iframe");
    var sizeText = backdrop.querySelector(".device-preview-size");

    function setSize(px) {
      px = Number(px);
      frame.style.width = Math.min(px, Math.max(320, window.innerWidth - 70)) + "px";
      sizeText.textContent = px + "px viewport";
      backdrop.querySelectorAll(".device-preview-option").forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-size") === String(px));
      });
    }
    backdrop.querySelectorAll(".device-preview-option").forEach(function (b) {
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () { setSize(b.getAttribute("data-size")); });
    });
    backdrop.querySelector(".device-preview-close").addEventListener("click", closePreview);
    backdrop.addEventListener("click", function (e) { if (e.target === backdrop) closePreview(); });
    backdrop.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); closePreview(); }
    });
    iframe.src = page || "index.html";
    setSize(width);
    backdrop.querySelector(".device-preview-option[data-size='" + width + "']").focus();
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var width = button.getAttribute("data-preview-width");
      var label = button.textContent.trim();
      openPreview(width, label, button);
    });
  });
})();
