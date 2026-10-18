/* nav.js — opens/closes the sidebar as a drawer on small screens. */
(function () {
  var sidebar = document.getElementById("sidebar");
  var backdrop = document.querySelector(".sidebar-backdrop");
  var openers = document.querySelectorAll("[data-nav-open]");
  if (!sidebar) return;

  function open() {
    sidebar.classList.add("is-open");
    if (backdrop) backdrop.hidden = false;
    openers.forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
    document.body.style.overflow = "hidden";
    var first = sidebar.querySelector("a, button");
    if (first) first.focus();
  }

  function close() {
    if (!sidebar.classList.contains("is-open")) return;
    sidebar.classList.remove("is-open");
    if (backdrop) backdrop.hidden = true;
    openers.forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    document.body.style.overflow = "";
    if (openers[0]) openers[0].focus();
  }

  openers.forEach(function (b) { b.addEventListener("click", open); });
  document.querySelectorAll("[data-nav-close]").forEach(function (el) { el.addEventListener("click", close); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", function (e) { if (e.matches) close(); });
})();
