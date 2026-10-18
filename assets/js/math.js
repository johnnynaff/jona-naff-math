/* math.js — renders LaTeX with KaTeX.
   In pages write  $$ … $$  for display maths and  \( … \)  for inline maths.
   (Kramdown turns $$…$$ written inside a paragraph into \(…\) automatically.) */
window.addEventListener("DOMContentLoaded", function () {
  if (typeof renderMathInElement !== "function") return;
  renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false }
    ],
    ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
    throwOnError: false
  });
});
