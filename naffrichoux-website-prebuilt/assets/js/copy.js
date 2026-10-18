/* copy.js — "Copy" buttons (BibTeX entries, email address).
   [data-copy-text="…"] copies that text; [data-copy-from="selector"] copies the text of
   the matching element inside the button's parent. */
(function () {
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } finally { document.body.removeChild(ta); }
    return Promise.resolve();
  }

  document.querySelectorAll("[data-copy-text], [data-copy-from]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy-text");
      if (text === null) {
        var src = btn.parentElement.querySelector(btn.getAttribute("data-copy-from"));
        text = src ? src.textContent : "";
      }
      var label = btn.querySelector("[data-copy-label]");
      var original = label ? label.textContent : null;
      copy(text.trim()).then(function () {
        if (label) {
          label.textContent = "Copied";
          setTimeout(function () { label.textContent = original; }, 1600);
        }
      });
    });
  });
})();
