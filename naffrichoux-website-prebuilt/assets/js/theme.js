/* theme.js — the light/dark toggle in the sidebar.
   Dispatches a "themechange" event so drawings (e.g. the home figure) can redraw. */
(function () {
  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function current() { return root.getAttribute("data-theme-current") || "light"; }

  function apply(theme, save) {
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-theme-current", theme);
    if (save) { try { localStorage.setItem("theme", theme); } catch (e) {} }
    updateLabels();
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
  }

  function updateLabels() {
    var next = current() === "dark" ? "Light mode" : "Dark mode";
    document.querySelectorAll("[data-theme-label]").forEach(function (el) { el.textContent = next; });
  }

  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () { apply(current() === "dark" ? "light" : "dark", true); });
  });

  // Follow the system setting while the visitor has not chosen explicitly.
  media.addEventListener("change", function (e) {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (err) {}
    if (!saved) {
      root.removeAttribute("data-theme");
      root.setAttribute("data-theme-current", e.matches ? "dark" : "light");
      updateLabels();
      document.dispatchEvent(new CustomEvent("themechange"));
    }
  });

  updateLabels();
})();
