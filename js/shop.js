(function () {
  "use strict";
  var grid = document.getElementById("product-grid");
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var searchInput = document.getElementById("product-search");
  var resultsCount = document.getElementById("results-count");
  var emptyState = document.getElementById("empty-state");
  var loadingLabel = document.getElementById("filter-loading");
  var activeCategory = "all";
  var filterTimer;

  function normalise(text) { return (text || "").toLowerCase().trim(); }
  function applyFilters() {
    var query = normalise(searchInput ? searchInput.value : "");
    var visibleCount = 0;
    if (loadingLabel) loadingLabel.hidden = false;
    cards.forEach(function (card) {
      var category = card.getAttribute("data-category") || "";
      var name = normalise(card.getAttribute("data-name"));
      var desc = normalise(card.getAttribute("data-desc"));
      var show = (activeCategory === "all" || category === activeCategory) && (query === "" || name.indexOf(query) !== -1 || desc.indexOf(query) !== -1);
      card.hidden = !show;
      if (show) visibleCount += 1;
    });
    if (resultsCount) resultsCount.textContent = visibleCount === 1 ? "Showing 1 piece" : "Showing " + visibleCount + " pieces";
    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
      emptyState.classList.toggle("is-visible", visibleCount === 0);
    }
    window.clearTimeout(filterTimer);
    filterTimer = window.setTimeout(function () { if (loadingLabel) loadingLabel.hidden = true; }, 180);
  }
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      chip.setAttribute("aria-pressed", "true");
      activeCategory = chip.getAttribute("data-filter") || "all";
      applyFilters();
    });
  });
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  applyFilters();

  function toggleSaved(button) {
    var saved = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!saved));
    button.textContent = saved ? "♡" : "♥";
    button.setAttribute("aria-label", saved ? "Save this piece" : "Remove this piece from saved items");
  }
  grid.addEventListener("click", function (event) {
    var wish = event.target.closest("[data-wishlist]");
    if (wish) { toggleSaved(wish); return; }
    var trigger = event.target.closest("[data-quick-view]");
    if (!trigger || trigger.closest("[hidden]")) return;
    var card = trigger.closest(".card");
    if (card) openModal(card, trigger);
  });

  /* ---- Accessible product detail modal ---- */
  var overlay = document.getElementById("quick-view");
  if (!overlay) return;
  var modal = overlay.querySelector(".modal");
  var modalMedia = document.getElementById("qv-media");
  var modalTag = document.getElementById("qv-tag");
  var modalTitle = document.getElementById("qv-title");
  var modalPrice = document.getElementById("qv-price");
  var modalDesc = document.getElementById("qv-desc");
  var modalDetails = document.getElementById("qv-details");
  var closeBtn = overlay.querySelector(".modal-close");
  var qvSave = overlay.querySelector("[data-qv-save]");
  var lastTrigger = null;
  var previousBodyOverflow = "";

  function getFocusable() { return Array.prototype.slice.call(overlay.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')); }
  function openModal(card, trigger) {
    if (!modalMedia || !modalTitle || !modalDesc || !closeBtn) return;
    lastTrigger = trigger || document.activeElement;
    var media = card.querySelector(".card-media");
    modalMedia.innerHTML = media ? media.innerHTML : "";
    var copiedImg = modalMedia.querySelector("img");
    if (copiedImg) {
      copiedImg.hidden = false;
      copiedImg.classList.add("product-photo");
      copiedImg.removeAttribute("loading");
      copiedImg.addEventListener("error", function () { copiedImg.hidden = true; }, { once: true });
    }
    modalTag.textContent = card.getAttribute("data-category-label") || "";
    modalTitle.textContent = card.getAttribute("data-name") || "";
    modalPrice.textContent = card.getAttribute("data-price") || "";
    modalDesc.textContent = card.getAttribute("data-desc") || "";
    if (modalDetails) {
      modalDetails.innerHTML = "";
      Array.prototype.slice.call(card.querySelectorAll(".product-meta li")).forEach(function (item) {
        var li = document.createElement("li"); li.textContent = item.textContent; modalDetails.appendChild(li);
      });
    }
    var saved = card.querySelector("[data-wishlist]");
    if (qvSave) qvSave.setAttribute("aria-pressed", saved ? saved.getAttribute("aria-pressed") : "false");
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }
  function closeModal() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousBodyOverflow;
    if (lastTrigger && document.contains(lastTrigger) && !lastTrigger.closest("[hidden]")) lastTrigger.focus();
    lastTrigger = null;
  }
  closeBtn.addEventListener("click", closeModal);
  if (qvSave) qvSave.addEventListener("click", function () {
    var card = lastTrigger && lastTrigger.closest(".card");
    if (!card) return;
    var original = card.querySelector("[data-wishlist]");
    if (original) { toggleSaved(original); qvSave.setAttribute("aria-pressed", original.getAttribute("aria-pressed")); }
  });
  overlay.addEventListener("click", function (event) { if (event.target === overlay) closeModal(); });
  if (modal) modal.addEventListener("click", function (event) { event.stopPropagation(); });
  document.addEventListener("keydown", function (event) {
    if (!overlay.classList.contains("is-open")) return;
    if (event.key === "Escape") { event.preventDefault(); closeModal(); return; }
    if (event.key !== "Tab") return;
    var focusable = getFocusable(); if (!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
