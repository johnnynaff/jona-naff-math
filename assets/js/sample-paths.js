/* sample-paths.js — interactive figure on the home page.
   Simulates dX = (X - X^3) dt + sigma dW with the Euler–Maruyama scheme.
   Moving the slider re-uses the same Brownian increments, so you see the effect of sigma alone;
   "Resample" draws new increments. Colours come from --path-colors in tokens.css. */
(function () {
  var fig = document.querySelector("[data-sample-paths]");
  if (!fig) return;

  var canvas = fig.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var slider = fig.querySelector("[data-sigma]");
  var out = fig.querySelector("[data-sigma-out]");
  var resample = fig.querySelector("[data-resample]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var N_PATHS = 4, T = 30, STEPS = 1500, DT = T / STEPS, Y_MAX = 2.1;
  var noise = [], paths = [], frame = null;

  function gaussian() {
    var u = 1 - Math.random(), v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function newNoise() {
    noise = [];
    for (var p = 0; p < N_PATHS; p++) {
      var z = new Float64Array(STEPS);
      for (var k = 0; k < STEPS; k++) z[k] = gaussian();
      noise.push(z);
    }
  }

  function simulate(sigma) {
    var sq = Math.sqrt(DT);
    paths = noise.map(function (z) {
      var x = new Float64Array(STEPS + 1);
      x[0] = 0;
      for (var k = 0; k < STEPS; k++) {
        var xn = x[k] + (x[k] - x[k] * x[k] * x[k]) * DT + sigma * sq * z[k];
        x[k + 1] = Math.max(-Y_MAX * 1.5, Math.min(Y_MAX * 1.5, xn));
      }
      return x;
    });
  }

  function colors() {
    var s = getComputedStyle(document.documentElement);
    return {
      paths: s.getPropertyValue("--path-colors").split(",").map(function (c) { return c.trim(); }),
      rule: s.getPropertyValue("--rule").trim(),
      faint: s.getPropertyValue("--ink-faint").trim(),
      surface: s.getPropertyValue("--surface").trim()
    };
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(progress) {
    var w = canvas.clientWidth, h = canvas.clientHeight, c = colors();
    var padL = 26, padR = 6, padT = 8, padB = 8;
    var X = function (k) { return padL + (k / STEPS) * (w - padL - padR); };
    var Y = function (v) { return padT + (1 - (v + Y_MAX) / (2 * Y_MAX)) * (h - padT - padB); };

    ctx.clearRect(0, 0, w, h);

    // Wells at ±1 (dashed) and axis at 0
    ctx.lineWidth = 1;
    ctx.strokeStyle = c.rule;
    [-1, 1].forEach(function (v) {
      ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(padL, Y(v)); ctx.lineTo(w - padR, Y(v)); ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(padL, Y(0)); ctx.lineTo(w - padR, Y(0)); ctx.stroke();

    ctx.fillStyle = c.faint;
    ctx.font = "11px 'IBM Plex Mono', monospace";
    ctx.textBaseline = "middle";
    ctx.fillText("+1", 2, Y(1));
    ctx.fillText(" 0", 2, Y(0));
    ctx.fillText("−1", 2, Y(-1));

    var last = Math.max(1, Math.floor(STEPS * progress));
    ctx.lineWidth = 1.15;
    ctx.lineJoin = "round";
    paths.forEach(function (x, p) {
      ctx.strokeStyle = c.paths[p % c.paths.length];
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(X(0), Y(x[0]));
      for (var k = 1; k <= last; k++) ctx.lineTo(X(k), Y(x[k]));
      ctx.stroke();
      // a dot at the current end of each path
      ctx.globalAlpha = 1;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath(); ctx.arc(X(last), Y(x[last]), 2.4, 0, 2 * Math.PI); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function animate() {
    if (frame) cancelAnimationFrame(frame);
    if (reduceMotion) { draw(1); return; }
    var start = null, duration = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / duration);
      draw(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
  }

  function sigma() { return parseFloat(slider.value); }

  slider.addEventListener("input", function () {
    if (frame) cancelAnimationFrame(frame);
    out.textContent = sigma().toFixed(2);
    simulate(sigma());
    draw(1);
  });
  resample.addEventListener("click", function () { newNoise(); simulate(sigma()); animate(); });
  document.addEventListener("themechange", function () { draw(1); });
  window.addEventListener("resize", function () { resize(); draw(1); });

  out.textContent = sigma().toFixed(2);
  resize();
  newNoise();
  simulate(sigma());
  animate();
})();
