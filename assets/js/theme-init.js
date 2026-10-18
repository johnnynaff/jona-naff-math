/* theme-init.js — runs in <head> before the page paints.
   Applies the visitor's saved light/dark choice, otherwise follows the system setting. */
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* storage unavailable */ }
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  var dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme-current", dark ? "dark" : "light");
})();
