/* fbm-paths.js — interactive figure on the home page (fractional-noise version).
   Simulates dX = (X - X^3) dt + dB^H_t  (sigma = 1) with an Euler scheme, where B^H is a
   fractional Brownian motion with Hurst index H, generated exactly by the Davies–Harte
   (circulant embedding) method.
   Moving the slider keeps the same underlying Gaussian variables, so only H changes;
   "Resample" draws new ones. Colours come from --path-colors in tokens.css. */
(function () {
  var fig = document.querySelector("[data-fbm-paths]");
  if (!fig) return;

  var canvas = fig.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var slider = fig.querySelector("[data-hurst]");
  var out = fig.querySelector("[data-hurst-out]");
  var hint = fig.querySelector("[data-hurst-hint]");
  var resample = fig.querySelector("[data-resample]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var N_PATHS = 4, T = 30, STEPS = 2048, DT = T / STEPS, Y_MAX = 2.1;
  var M = 2 * STEPS;                 // size of the circulant embedding
  var normals = [], paths = [], frame = null;

  /* ---------- Gaussian variables ---------- */
  function gaussian() {
    var u = 1 - Math.random(), v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function newNormals() {
    normals = [];
    for (var p = 0; p < N_PATHS; p++) {
      var z = new Float64Array(M);   // z[0], z[STEPS] real parts; pairs (z[j], z[M-j]) for 0<j<STEPS
      for (var k = 0; k < M; k++) z[k] = gaussian();
      normals.push(z);
    }
  }

  /* ---------- In-place radix-2 FFT (re, im arrays of length M) ---------- */
  function fft(re, im) {
    var n = re.length, i, j, k, len;
    for (i = 1, j = 0; i < n; i++) {
      var bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) {
        var t = re[i]; re[i] = re[j]; re[j] = t;
        t = im[i]; im[i] = im[j]; im[j] = t;
      }
    }
    for (len = 2; len <= n; len <<= 1) {
      var ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
      for (i = 0; i < n; i += len) {
        var cr = 1, ci = 0;
        for (k = 0; k < len / 2; k++) {
          var a = i + k, b = a + len / 2;
          var xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
          re[b] = re[a] - xr; im[b] = im[a] - xi;
          re[a] += xr; im[a] += xi;
          var nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
        }
      }
    }
  }

  /* ---------- Eigenvalues of the circulant embedding of fractional Gaussian noise ---------- */
  function eigenvalues(H) {
    var h2 = 2 * H;
    function gamma(k) { return 0.5 * (Math.pow(k + 1, h2) - 2 * Math.pow(k, h2) + Math.pow(Math.abs(k - 1), h2)); }
    var re = new Float64Array(M), im = new Float64Array(M);
    for (var j = 0; j <= STEPS; j++) re[j] = gamma(j);
    for (j = 1; j < STEPS; j++) re[M - j] = re[j];
    fft(re, im);
    for (j = 0; j < M; j++) re[j] = Math.max(re[j], 0);  // guard against round-off
    return re;
  }

  /* fGn sample of length STEPS (unit time step) from eigenvalues and stored normals z */
  function fgn(lambda, z) {
    var re = new Float64Array(M), im = new Float64Array(M);
    re[0] = Math.sqrt(lambda[0] / M) * z[0];
    re[STEPS] = Math.sqrt(lambda[STEPS] / M) * z[STEPS];
    for (var j = 1; j < STEPS; j++) {
      var s = Math.sqrt(lambda[j] / (2 * M));
      re[j] = s * z[j];        im[j] = s * z[M - j];
      re[M - j] = re[j];       im[M - j] = -im[j];
    }
    fft(re, im);
    return re.subarray(0, STEPS);
  }

  function simulate(H) {
    var lambda = eigenvalues(H);
    var scale = Math.pow(DT, H);       // self-similarity: increments over a step of size DT
    paths = normals.map(function (z) {
      var g = fgn(lambda, z);
      var x = new Float64Array(STEPS + 1);
      x[0] = 0;
      for (var k = 0; k < STEPS; k++) {
        var xn = x[k] + (x[k] - x[k] * x[k] * x[k]) * DT + scale * g[k];
        x[k + 1] = Math.max(-Y_MAX * 1.5, Math.min(Y_MAX * 1.5, xn));
      }
      return x;
    });
  }

  /* ---------- Drawing ---------- */
  function colors() {
    var s = getComputedStyle(document.documentElement);
    return {
      paths: s.getPropertyValue("--path-colors").split(",").map(function (c) { return c.trim(); }),
      rule: s.getPropertyValue("--rule").trim(),
      faint: s.getPropertyValue("--ink-faint").trim()
    };
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(progress) {
    var w = canvas.clientWidth, h = canvas.clientHeight, c = colors();
    var padL = 26, padR = 6, padT = 8, padB = 8;
    var X = function (k) { return padL + (k / STEPS) * (w - padL - padR); };
    var Y = function (v) { return padT + (1 - (v + Y_MAX) / (2 * Y_MAX)) * (h - padT - padB); };

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();

    ctx.lineWidth = 1;
    ctx.strokeStyle = c.rule;
    ctx.setLineDash([3, 4]);
    [-1, 1].forEach(function (v) { ctx.beginPath(); ctx.moveTo(padL, Y(v)); ctx.lineTo(w - padR, Y(v)); ctx.stroke(); });
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(padL, Y(0)); ctx.lineTo(w - padR, Y(0)); ctx.stroke();

    ctx.fillStyle = c.faint;
    ctx.font = "11px 'IBM Plex Mono', monospace";
    ctx.textBaseline = "middle";
    ctx.fillText("+1", 2, Y(1)); ctx.fillText(" 0", 2, Y(0)); ctx.fillText("−1", 2, Y(-1));

    var last = Math.max(1, Math.floor(STEPS * progress));
    ctx.lineWidth = 1.1;
    ctx.lineJoin = "round";
    paths.forEach(function (x, p) {
      ctx.strokeStyle = c.paths[p % c.paths.length];
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(X(0), Y(x[0]));
      for (var k = 1; k <= last; k++) ctx.lineTo(X(k), Y(x[k]));
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath(); ctx.arc(X(last), Y(x[last]), 2.4, 0, 2 * Math.PI); ctx.fill();
    });
    ctx.restore();
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

  /* ---------- Controls ---------- */
  function H() { return parseFloat(slider.value); }

  function updateLabels() {
    var h = H();
    out.textContent = h.toFixed(2);
    if (hint) {
      hint.textContent = Math.abs(h - 0.5) < 1e-9 ? "standard Brownian motion"
        : h < 0.5 ? "rougher than Brownian motion" : "smoother than Brownian motion";
    }
  }

  slider.addEventListener("input", function () {
    if (frame) cancelAnimationFrame(frame);
    updateLabels();
    simulate(H());
    draw(1);
  });
  resample.addEventListener("click", function () { newNormals(); simulate(H()); animate(); });
  document.addEventListener("themechange", function () { draw(1); });
  window.addEventListener("resize", function () { resize(); draw(1); });

  updateLabels();
  resize();
  newNormals();
  simulate(H());
  animate();
})();
