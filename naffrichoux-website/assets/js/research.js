/* research.js — opens the theme card targeted by a link such as /research/#fractional-noise
   (the Home page links each research interest to its card). */
(function () {
  function openTarget() {
    var el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (el && el.tagName === "DETAILS") {
      el.open = true;
      el.scrollIntoView({ block: "start" });
    }
  }
  window.addEventListener("hashchange", openTarget);
  openTarget();
})();
