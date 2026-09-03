(function () {
  "use strict";

  const OPACITIES = [0.12, 0.18, 0.28, 0.4, 0.55, 0.7, 0.85, 1];
  const ROWS = 4;
  const COLS = 5;
  const EMPTY_CHANCE = 0.32;

  function buildGrid(el) {
    const total = ROWS * COLS;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
      const tile = document.createElement("span");
      if (Math.random() < EMPTY_CHANCE) {
        tile.style.visibility = "hidden";
      } else {
        const o = OPACITIES[Math.floor(Math.random() * OPACITIES.length)];
        tile.style.opacity = o;
      }
      frag.appendChild(tile);
    }
    el.appendChild(frag);
  }

  document.querySelectorAll(".tile-grid[data-random]").forEach(buildGrid);

  const portrait = document.querySelector(".hero__portrait");
  const img = portrait && portrait.querySelector(".hero__portrait-img");
  if (portrait && img) {
    if (img.complete && img.naturalWidth === 0) {
      portrait.classList.add("hero__portrait--fallback");
    }
    img.addEventListener("error", () => portrait.classList.add("hero__portrait--fallback"));
  }
})();