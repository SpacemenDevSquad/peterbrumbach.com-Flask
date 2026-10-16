// Unity WebGL mini-player: click-to-load, Bootstrap progress bar, fullscreen toggle.
// Works for every element marked [data-unity-player] on the page.
(function () {
  "use strict";

  // The macro includes this script once per player; only run the first copy.
  if (window.__unityPlayerLoaded) return;
  window.__unityPlayerLoaded = true;

  const loadedScripts = {};
  let playerCount = 0;

  function loadScript(src) {
    if (!loadedScripts[src]) {
      loadedScripts[src] = new Promise(function (resolve, reject) {
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = function () { reject(new Error("Failed to load " + src)); };
        document.body.appendChild(s);
      });
    }
    return loadedScripts[src];
  }

  function initPlayer(root) {
    if (root.dataset.unityReady) return;
    root.dataset.unityReady = "true";
    const cfg = JSON.parse(root.dataset.unityConfig);
    const canvas = root.querySelector("canvas");
    // Unity finds its canvas with querySelector("#" + canvas.id), so it must have a unique id.
    if (!canvas.id) canvas.id = "unity-canvas-" + (++playerCount);
    const overlay = root.querySelector("[data-unity-overlay]");
    const startBtn = root.querySelector("[data-unity-start]");
    const progress = root.querySelector(".progress");
    const bar = root.querySelector(".progress-bar");
    const status = root.querySelector("[data-unity-status]");
    const fsBtn = root.querySelector("[data-unity-fullscreen]");
    let started = false;

    function setProgress(p) {
      const pct = Math.round(p * 100);
      bar.style.width = pct + "%";
      progress.setAttribute("aria-valuenow", pct);
    }

    function start() {
      if (started) return;
      started = true;
      startBtn.classList.add("d-none");
      progress.classList.remove("d-none");

      loadScript(cfg.loaderUrl)
        .then(function () { return createUnityInstance(canvas, cfg, setProgress); })
        .then(function () {
          // Not needed once the game is running, so take them out of the page entirely.
          overlay.remove();
          root.querySelectorAll("[data-unity-cover]").forEach(function (el) { el.remove(); });
          canvas.focus();
        })
        .catch(function (err) {
          console.error("[unity-player]", err);
          progress.classList.add("d-none");
          status.textContent = "Couldn't load the game: " + err;
          status.classList.remove("d-none");
        });
    }

    // ---- Fullscreen ----
    function isFullscreen() {
      return document.fullscreenElement === root || root.classList.contains("unity-pseudo-fullscreen");
    }

    function setPseudo(on) {
      root.classList.toggle("unity-pseudo-fullscreen", on);
      document.body.classList.toggle("overflow-hidden", on);
      updateButton();
    }

    function updateButton() {
      fsBtn.textContent = isFullscreen() ? "Exit fullscreen" : "Fullscreen";
    }

    function toggleFullscreen() {
      if (!started) start(); // going fullscreen implies "play"
      if (document.fullscreenElement === root) {
        document.exitFullscreen();
      } else if (root.classList.contains("unity-pseudo-fullscreen")) {
        setPseudo(false);
      } else if (root.requestFullscreen) {
        root.requestFullscreen().catch(function () { setPseudo(true); });
      } else {
        setPseudo(true); // iPhone Safari has no element fullscreen
      }
    }

    document.addEventListener("fullscreenchange", updateButton);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("unity-pseudo-fullscreen")) setPseudo(false);
    });

    startBtn.addEventListener("click", start);
    fsBtn.addEventListener("click", toggleFullscreen);
    if (root.dataset.unityAutoload === "true") start();
  }

  function initAll() {
    document.querySelectorAll("[data-unity-player]").forEach(function (root) {
      try {
        initPlayer(root);
      } catch (err) {
        console.error("[unity-player] couldn't set up player", root, err);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
