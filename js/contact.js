(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");

  var validators = {
    name: function (value) {
      if (value.trim().length < 2) return "Enter your full name.";
      return "";
    },
    email: function (value) {
      var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.trim() === "") return "Enter your email address.";
      if (!pattern.test(value.trim())) return "Enter a valid email address, e.g. name@example.com.";
      return "";
    },
    subject: function (value) {
      if (value === "") return "Choose a topic for your message.";
      return "";
    },
    message: function (value) {
      if (value.trim().length < 10) return "Your message should be at least 10 characters.";
      return "";
    }
  };

  function fieldWrapper(input) {
    return input.closest(".field");
  }

  function showError(input, message) {
    var wrapper = fieldWrapper(input);
    var errorEl = document.getElementById(input.id + "-error");
    if (wrapper) wrapper.classList.toggle("has-error", Boolean(message));
    if (errorEl) errorEl.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(input) {
    var validator = validators[input.name];
    if (!validator) return true;
    var message = validator(input.value);
    showError(input, message);
    return message === "";
  }

  Array.prototype.forEach.call(form.elements, function (input) {
    if (!validators[input.name]) return;
    input.addEventListener("blur", function () { validateField(input); });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var isValid = true;
    Array.prototype.forEach.call(form.elements, function (input) {
      if (!validators[input.name]) return;
      var fieldValid = validateField(input);
      isValid = isValid && fieldValid;
    });

    status.classList.remove("success", "error", "is-visible");

    if (!isValid) {
      status.textContent = "Please fix the highlighted fields and try again.";
      status.classList.add("error", "is-visible");
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // No backend in this prototype — simulate a successful send.
    status.textContent = "Thanks — your message has been sent. We usually reply within one business day.";
    status.classList.add("success", "is-visible");
    form.reset();
    Array.prototype.forEach.call(form.elements, function (input) {
      if (validators[input.name]) showError(input, "");
    });
  });
})();
