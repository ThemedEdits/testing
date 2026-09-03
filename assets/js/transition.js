/* ==========================================================================
   NUMERIQ GLOBAL — PAGE TRANSITION ENGINE
   ========================================================================== */

(function () {
  "use strict";

  const BAR_COUNT = 6;
  const EXIT_TRANSITION_KEY = "numeriq:exit-transition";
  const PAGE_SCROLL_KEY = "numeriq:page-scroll";

  const root = document.documentElement;
  const overlay = document.querySelector(".page-transition");
  const panel = overlay && overlay.querySelector(".page-transition__panel");
  const barsWrap = overlay && overlay.querySelector(".page-transition__bars");

  let arrivedFromTransition = false;
  try {
    arrivedFromTransition = sessionStorage.getItem(EXIT_TRANSITION_KEY) === "1";
    sessionStorage.removeItem(EXIT_TRANSITION_KEY);
    sessionStorage.removeItem(PAGE_SCROLL_KEY);
  } catch (e) {}

  if (!overlay || !panel || !barsWrap) {
    root.classList.remove("page-precovered", "is-locked", "is-transitioning");
    root.classList.add("transition-ready");
    document.dispatchEvent(new CustomEvent("numeriq:transition-complete"));
    return;
  }

  const EASE = "cubic-bezier(.76, 0, .24, 1)";
  const COVER_MS = 520;
  const BARS_MS = 480;
  const REVEAL_MS = 560;

  let currentBars = [];
  let lockedScrollY = 0;

  function buildBars() {
    barsWrap.innerHTML = "";
    const heights = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      heights.push(28 + Math.round(Math.random() * 62));
    }
    heights.forEach((h) => {
      const bar = document.createElement("span");
      bar.style.setProperty("--bar-h", h + "%");
      barsWrap.appendChild(bar);
    });
    currentBars = Array.from(barsWrap.children);
    return currentBars;
  }

  function lockScroll(scrollY = window.numeriqLenis ? window.numeriqLenis.scroll : window.scrollY) {
    lockedScrollY = scrollY;
    root.classList.add("is-locked", "is-transitioning");
    if (window.numeriqLenis) window.numeriqLenis.stop();
  }

  function unlockScroll() {
    root.classList.remove("is-locked", "is-transitioning");
    window.scrollTo(0, lockedScrollY);
    if (window.numeriqLenis) {
      window.numeriqLenis.scrollTo(lockedScrollY, { immediate: true, force: true });
      window.numeriqLenis.start();
    }
  }

  function animate(el, keyframes, options) {
    if (!el || !el.animate) return Promise.resolve();
    try {
      return el.animate(keyframes, { fill: "forwards", ...options }).finished.catch(() => {});
    } catch (e) {
      return Promise.resolve();
    }
  }

  function coverUp() {
    return animate(panel, [{ transform: "translateY(100%)" }, { transform: "translateY(0%)" }], {
      duration: COVER_MS,
      easing: EASE,
    });
  }

  function coverDown() {
    return animate(panel, [{ transform: "translateY(0%)" }, { transform: "translateY(100%)" }], {
      duration: REVEAL_MS,
      easing: EASE,
    });
  }

  async function growBars() {
    const bars = buildBars();
    barsWrap.style.opacity = "1";
    const jobs = bars.map((bar, i) => {
      const delay = i * 20;
      return animate(bar, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], {
        duration: BARS_MS - delay * 0.3,
        delay,
        easing: "cubic-bezier(.2,.9,.3,1)",
      });
    });
    await Promise.all(jobs);
  }

  async function shrinkBars() {
    if (currentBars.length === 0) return;
    barsWrap.style.opacity = "1";
    const jobs = currentBars.map((bar, i) => {
      const delay = i * 15;
      return animate(bar, [{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], {
        duration: BARS_MS * 0.6 - delay * 0.2,
        delay,
        easing: "cubic-bezier(.4,0,.6,1)",
      });
    });
    await Promise.all(jobs);
    resetBars();
  }

  function resetBars() {
    barsWrap.style.opacity = "0";
    barsWrap.innerHTML = "";
    currentBars = [];
  }

  async function playEntrance() {
    // If fresh page load (not coming from clicking an internal link)
    if (!arrivedFromTransition) {
      root.classList.remove("page-precovered", "is-locked", "is-transitioning");
      panel.style.transform = "translateY(100%)";
      resetBars();
      unlockScroll();
      root.classList.add("transition-ready");
      document.dispatchEvent(new CustomEvent("numeriq:transition-complete"));
      return;
    }

    // Arrived from internal link click
    lockScroll();
    root.classList.remove("page-precovered");
    if (panel.getAnimations) {
      panel.getAnimations().forEach((a) => a.cancel());
    }
    panel.style.transform = "translateY(0%)";

    await shrinkBars();
    await coverDown();
    panel.style.transform = "translateY(100%)";
    unlockScroll();
    root.classList.add("transition-ready");
    document.dispatchEvent(new CustomEvent("numeriq:transition-complete"));
  }

  async function playExit(href) {
    lockScroll();
    await coverUp();
    await growBars();
    try {
      sessionStorage.setItem(EXIT_TRANSITION_KEY, "1");
    } catch (e) {}
    window.location.href = href;
  }

  function isTransitionable(link) {
    if (!link) return false;
    if (link.target && link.target !== "_self") return false;
    if (link.hasAttribute("download")) return false;
    if (link.dataset.noTransition !== undefined) return false;
    try {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      if (url.pathname === window.location.pathname && url.hash) return false;
      if (link.href === window.location.href) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest("a[href]");
    if (!isTransitionable(link)) return;
    e.preventDefault();
    playExit(link.href);
  });

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      root.classList.remove("page-precovered", "is-locked", "is-transitioning");
      if (panel.getAnimations) {
        panel.getAnimations().forEach((a) => a.cancel());
      }
      panel.style.transform = "translateY(100%)";
      resetBars();
      unlockScroll();
      root.classList.add("transition-ready");
      document.dispatchEvent(new CustomEvent("numeriq:transition-complete"));
    }
  });

  function savePageScroll() {
    try {
      if (sessionStorage.getItem(EXIT_TRANSITION_KEY) === "1") return;
      sessionStorage.setItem(PAGE_SCROLL_KEY, JSON.stringify({
        href: window.location.href,
        y: window.scrollY,
      }));
    } catch (e) {}
  }

  window.addEventListener("pagehide", savePageScroll);
  window.addEventListener("beforeunload", savePageScroll);

  window.numeriqTransition = { playEntrance, playExit };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", playEntrance);
  } else {
    playEntrance();
  }
})();