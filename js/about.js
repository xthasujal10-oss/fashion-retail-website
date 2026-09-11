(function () {
  "use strict";

  var triggers = Array.prototype.slice.call(document.querySelectorAll(".accordion-trigger"));
  if (triggers.length === 0) return;

  function getPanel(trigger) {
    return document.getElementById(trigger.getAttribute("aria-controls"));
  }

  function closePanel(trigger, panel) {
    trigger.setAttribute("aria-expanded", "false");
    if (!panel) return;
    panel.style.maxHeight = panel.scrollHeight + "px";
    requestAnimationFrame(function () {
      panel.style.maxHeight = "0px";
    });
    window.setTimeout(function () {
      if (trigger.getAttribute("aria-expanded") === "false") {
        panel.hidden = true;
      }
    }, 190);
  }

  function openPanel(trigger, panel) {
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    panel.style.maxHeight = "0px";
    requestAnimationFrame(function () {
      panel.style.maxHeight = panel.scrollHeight + "px";
    });
  }

  triggers.forEach(function (trigger) {
    var panel = getPanel(trigger);
    if (!panel) return;

    panel.hidden = trigger.getAttribute("aria-expanded") !== "true";

    trigger.addEventListener("click", function () {
      var isOpen = trigger.getAttribute("aria-expanded") === "true";

      triggers.forEach(function (other) {
        if (other === trigger) return;
        var otherPanel = getPanel(other);
        if (otherPanel && other.getAttribute("aria-expanded") === "true") {
          closePanel(other, otherPanel);
        } else if (otherPanel) {
          otherPanel.hidden = true;
        }
      });

      if (isOpen) {
        closePanel(trigger, panel);
      } else {
        openPanel(trigger, panel);
      }
    });
  });
})();
