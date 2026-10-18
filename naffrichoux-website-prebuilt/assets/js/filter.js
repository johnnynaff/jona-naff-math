/* filter.js — type buttons + search box for publications and talks.
   Markup: a [data-filter-bar] followed (anywhere after it) by [data-filter-item] elements
   carrying data-type and data-search. Year headings ([data-filter-group]) hide when empty. */
(function () {
  document.querySelectorAll("[data-filter-bar]").forEach(function (bar) {
    var scope = bar.parentElement;
    var items = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-item]"));
    var groups = scope.querySelectorAll("[data-filter-group]");
    var buttons = bar.querySelectorAll("[data-filter]");
    var search = bar.querySelector("[data-filter-search]");
    var empty = scope.querySelector("[data-filter-empty]");
    var active = "all";

    // Show how many items each button covers; hide buttons with none.
    buttons.forEach(function (btn) {
      var type = btn.getAttribute("data-filter");
      var n = type === "all" ? items.length : items.filter(function (i) { return i.dataset.type === type; }).length;
      if (n === 0 && type !== "all") { btn.hidden = true; return; }
      var c = document.createElement("span");
      c.className = "filter-button__count";
      c.textContent = n;
      btn.appendChild(c);
    });

    function run() {
      var q = (search && search.value || "").trim().toLowerCase();
      var shown = 0;
      items.forEach(function (item) {
        var okType = active === "all" || item.dataset.type === active;
        var okText = !q || (item.dataset.search || "").indexOf(q) !== -1;
        var visible = okType && okText;
        if (visible) { item.removeAttribute("data-filter-hidden"); shown++; }
        else item.setAttribute("data-filter-hidden", "");
      });
      groups.forEach(function (g) {
        var any = g.querySelector("[data-filter-item]:not([data-filter-hidden])");
        if (any) g.removeAttribute("data-filter-hidden"); else g.setAttribute("data-filter-hidden", "");
      });
      if (empty) empty.hidden = shown !== 0;
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        active = btn.getAttribute("data-filter");
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        run();
      });
    });
    if (search) search.addEventListener("input", run);
    run();
  });
})();
