// Endless, auto-scrolling project strip that visitors can also scroll themselves.
// Works for every element marked [data-project-marquee] on the page.
//
// How it works: the strip is an ordinary horizontal scroll box, so touch swipes and
// trackpads work natively. The cards are copied several times, and the strip is
// kept inside the middle copy; jumping by exactly one copy's width is invisible,
// so it never reaches an end.
(function () {
  "use strict";

  if (window.__projectMarqueeLoaded) return;
  window.__projectMarqueeLoaded = true;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const IDLE_MS = 3000; // how long to wait after the visitor scrolls before auto-scroll resumes

  function initMarquee(root) {
    const track = root.querySelector("[data-marquee-track]");
    const originals = Array.from(track.children);
    const section = root.closest("section") || document;
    const prevBtn = section.querySelector("[data-marquee-prev]");
    const nextBtn = section.querySelector("[data-marquee-next]");
    const speed = parseFloat(root.dataset.speed) || 40; // pixels per second

    let setWidth = 0;      // width of one full set of cards (incl. gaps)
    let pos = 0;           // precise scroll position while auto-scrolling
    let running = false;
    let hovering = false;
    let dragging = false;
    let dragMoved = false;
    let idleUntil = 0;
    let settleTimer = null;
    let last = null;

    const gap = () => parseFloat(getComputedStyle(track).columnGap) || 0;

    // ---- Build the copies ----
    function build() {
      track.querySelectorAll("[data-marquee-clone]").forEach(function (el) { el.remove(); });
      setWidth = originals.reduce(function (w, el) { return w + el.offsetWidth; }, 0) + gap() * originals.length;
      if (!setWidth) return;

      // Enough copies for 2 sets of room on each side of the visible area
      const copies = 5 + Math.ceil(root.clientWidth / setWidth);
      for (let i = 1; i < copies; i++) {
        originals.forEach(function (el) {
          const clone = el.cloneNode(true);
          clone.dataset.marqueeClone = "";
          clone.setAttribute("aria-hidden", "true"); // screen readers and Tab only see the real cards
          clone.querySelectorAll("a, button").forEach(function (a) { a.tabIndex = -1; });
          track.appendChild(clone);
        });
      }
      root.scrollLeft = pos = 2 * setWidth;
    }

    // Move back into the middle copy (invisible: every copy looks the same)
    function recenter() {
      if (!setWidth) return;
      const x = root.scrollLeft;
      const offset = (((x - 2 * setWidth) % setWidth) + setWidth) % setWidth;
      const target = 2 * setWidth + offset;
      if (Math.abs(target - x) > 1) root.scrollLeft = target;
      pos = root.scrollLeft;
    }

    function userIsScrolling() {
      idleUntil = performance.now() + IDLE_MS;
    }

    // ---- Auto-scroll ----
    function frame(t) {
      if (last !== null && setWidth) {
        const shouldRun = !reduceMotion.matches && !hovering && !dragging &&
                          !root.contains(document.activeElement) && t >= idleUntil;
        if (shouldRun) {
          if (!running) { recenter(); running = true; } // pick up from wherever the visitor left it
          pos += speed * Math.min((t - last) / 1000, 0.1);
          if (pos >= 3 * setWidth) pos -= setWidth;
          root.scrollLeft = pos;
        } else {
          running = false;
        }
      }
      last = t;
      requestAnimationFrame(frame);
    }

    // ---- Visitor scrolling (touch, trackpad, keyboard) ----
    root.addEventListener("touchstart", userIsScrolling, { passive: true });
    root.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) userIsScrolling(); // only sideways wheel/trackpad
    }, { passive: true });
    root.addEventListener("keydown", userIsScrolling);
    root.addEventListener("scroll", function () {
      if (running) return; // our own auto-scroll
      clearTimeout(settleTimer);
      settleTimer = setTimeout(function () { if (!dragging) recenter(); }, 150);
    }, { passive: true });

    // Pause while a mouse is over the strip so it's easy to read and click
    root.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hovering = true; });
    root.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") hovering = false; });

    // ---- Mouse drag ----
    let startX = 0, startScroll = 0;
    root.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      dragMoved = false;
      startX = e.clientX;
      startScroll = root.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!dragMoved && Math.abs(dx) > 5) {
        dragMoved = true;
        root.classList.add("is-dragging");
      }
      if (dragMoved) root.scrollLeft = startScroll - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!dragging) return;
      dragging = false;
      root.classList.remove("is-dragging");
      userIsScrolling();
      recenter();
    });
    // A drag shouldn't count as clicking the card it ended on
    root.addEventListener("click", function (e) {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = false;
      }
    }, true);

    // ---- Arrow buttons ----
    function scrollByCards(direction) {
      userIsScrolling();
      recenter();
      const cardStep = originals[0].offsetWidth + gap();
      const cards = Math.max(1, Math.floor(root.clientWidth / cardStep) - 1);
      root.scrollBy({ left: direction * cards * cardStep, behavior: reduceMotion.matches ? "auto" : "smooth" });
    }
    if (prevBtn) prevBtn.addEventListener("click", function () { scrollByCards(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { scrollByCards(1); });

    // Rebuild when the strip changes width (window resize, rotation)
    let lastWidth = root.clientWidth;
    new ResizeObserver(function () {
      if (Math.abs(root.clientWidth - lastWidth) < 1) return;
      lastWidth = root.clientWidth;
      build();
    }).observe(root);

    build();
    requestAnimationFrame(frame);
  }

  function initAll() {
    document.querySelectorAll("[data-project-marquee]").forEach(function (root) {
      if (root.dataset.marqueeReady) return;
      root.dataset.marqueeReady = "true";
      try {
        initMarquee(root);
      } catch (err) {
        console.error("[project-marquee] couldn't set up", root, err);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
