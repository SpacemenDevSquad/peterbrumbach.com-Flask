/**
 * Falling snow behind the page, drawn on one <canvas>.
 * Ported from the old React site's snow.js (Peter Brumbach, 2025).
 *
 * Usage (ES module):
 *   import snow from "/assets/js/snow.js";
 *   snow("/assets/images/ChristmasCrash/Snow.webp", { wind: 0.2 });
 *
 * Options (all optional):
 *   flakesPerSecond  how many flakes spawn each second        (default 20)
 *   fallSpeed        pixels per second                        (default 120)
 *   wind             sideways drift, + is right, - is left    (default 0)
 *   cursorWind       how much the mouse position blows snow   (default 0.15)
 *   size             flake size as a fraction of screen height (default 0.01)
 *
 * Skipped entirely for visitors who ask for reduced motion.
 */

export default function snow(imageUrl, options = {}) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const opts = {
    flakesPerSecond: 20,
    fallSpeed: 120,
    wind: 0,
    cursorWind: 0.15,
    size: 0.01,
    ...options,
  };

  const canvas = document.createElement("canvas");
  canvas.className = "snow-canvas position-fixed top-0 start-0 w-100 h-100 pe-none";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  const flake = new Image();
  flake.src = imageUrl;

  let flakes = [];
  let cursorX = 0;     // -1 (far left) .. 1 (far right)
  let spawnDebt = 0;
  let last = null;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  document.addEventListener("pointermove", function (e) {
    if (e.pointerType === "mouse") cursorX = (e.clientX / window.innerWidth) * 2 - 1;
  });

  function frame(t) {
    const dt = last === null ? 0 : Math.min((t - last) / 1000, 0.1);
    last = t;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const size = Math.max(4, h * opts.size);

    // Spawn
    spawnDebt += opts.flakesPerSecond * dt;
    while (spawnDebt >= 1) {
      spawnDebt -= 1;
      flakes.push({
        x: Math.random() * w * 1.4 - w * 0.2, // a little past the edges so wind can blow them in
        y: -size,
        speed: opts.fallSpeed * (0.7 + Math.random() * 0.6),
        drift: (Math.random() - 0.5) * 20,
        scale: 0.6 + Math.random() * 0.8,
      });
    }

    // Move and draw
    const blow = (opts.wind * 60) + (cursorX * opts.cursorWind * -300); // pixels per second sideways
    ctx.clearRect(0, 0, w, h);
    flakes = flakes.filter(function (f) {
      f.y += f.speed * dt;
      f.x += (blow + f.drift) * dt;
      const s = size * f.scale;
      if (flake.complete) ctx.drawImage(flake, f.x - s / 2, f.y - s / 2, s, s);
      return f.y < h + s;
    });

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
