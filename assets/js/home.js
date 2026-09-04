/* ==========================================================================
   HOME PAGE — decorative tile grid generator + hero image fallback
   ========================================================================== */
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


// Services Tabs
document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.services-tabs__btn');
  const slider = document.querySelector('.services-tabs__slider');
  let revealRun = 0;

  function revealPanelContent(panel) {
    const items = [
      panel.querySelector('.services-tabs__description'),
      ...panel.querySelectorAll('.service-card'),
    ].filter(Boolean);
    const run = ++revealRun;

    items.forEach((item) => {
      item.classList.remove('is-visible');
    });

    items.forEach((item, index) => {
      const delay = index === 0 ? 0 : 950 + (index - 1) * 160;
      window.setTimeout(() => {
        if (run === revealRun) item.classList.add('is-visible');
      }, delay);
    });
  }

  if (tabs.length && slider) {
    tabs.forEach(btn => {
      btn.addEventListener('click', function () {
        const tabId = this.dataset.tab;

        // Update buttons
        tabs.forEach(b => b.classList.remove('active'));
        tabs.forEach(b => b.setAttribute('aria-selected', 'false'));
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // Update slider
        slider.dataset.active = tabId;

        // Update panels
        const panels = document.querySelectorAll('.services-tabs__panel');
        panels.forEach(p => p.classList.remove('active'));
        const targetPanel = document.querySelector(`.services-tabs__panel[data-panel="${tabId}"]`);
        if (targetPanel) {
          targetPanel.classList.add('active');
          revealPanelContent(targetPanel);
        }
      });
    });
  }
});



/* Founder card flip — click/tap toggles (works alongside the CSS
   hover-flip on mouse devices; this is what makes it work on touch). */
document.querySelectorAll(".founder-card__flip").forEach((el) => {
  el.addEventListener("click", () => {
    const flipped = el.classList.toggle("is-flipped");
    el.setAttribute("aria-pressed", flipped ? "true" : "false");
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.click();
    }
  });
});


/* Scroll-linked timeline: the trail fills as the page scrolls, and each
   step's icon + heading + paragraph fades in once the trail reaches it. */
(function () {
  const timeline = document.querySelector("[data-timeline]");
  if (!timeline) return;

  const progressEl = timeline.querySelector("[data-timeline-progress]");
  const steps = Array.from(timeline.querySelectorAll("[data-timeline-step]"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let ticking = false;
  let cachedRect = null;
  let currentProgress = 0;
  const SMOOTHING = 0.12; // Adjust for more/less smoothing

  function updateProgress() {
    ticking = false;
    if (reduceMotion) {
      progressEl.style.transform = "translateX(-50%) scaleY(1)";
      return;
    }

    // Cache the rect to avoid reflow
    if (!cachedRect) {
      cachedRect = timeline.getBoundingClientRect();
    }

    const viewportMid = window.innerHeight * 0.55;
    const rawProgress = Math.min(1, Math.max(0, (viewportMid - cachedRect.top) / cachedRect.height));
    
    // Smooth the progress
    currentProgress = currentProgress + (rawProgress - currentProgress) * SMOOTHING;
    
    // Use transform for GPU acceleration
    progressEl.style.transform = `translateX(-50%) scaleY(${currentProgress})`;
  }

  function onScroll() {
    cachedRect = null; // Refresh rect on each scroll
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }

  // Invalidate cache on resize
  window.addEventListener("resize", () => {
    cachedRect = null;
  }, { passive: true });

  window.addEventListener("scroll", onScroll, { passive: true });
  if (window.numeriqLenis) window.numeriqLenis.on("scroll", onScroll);
  
  // Initial update
  updateProgress();

  /* ---- One-shot reveal per step as the trail reaches it ---- */
  if (reduceMotion) {
    steps.forEach((s) => s.classList.add("is-active"));
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-active");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
  );

  steps.forEach((step) => io.observe(step));
})();