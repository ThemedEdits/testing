/* ==========================================================================
   PROCESS PAGE — center-line scroll-linked timeline.
   Same mechanic as the homepage's left-aligned timeline (trail fills on
   scroll, each stage reveals once reached) reimplemented against this
   page's own data attributes, since home.js is landing-page scoped and
   isn't loaded here.
   ========================================================================== */
(function () {
  const timeline = document.querySelector("[data-process-timeline]");
  if (!timeline) return;

  const progressEl = timeline.querySelector("[data-process-progress]");
  const steps = Array.from(timeline.querySelectorAll("[data-process-step]"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let ticking = false;
  function updateProgress() {
    ticking = false;
    if (reduceMotion) {
      progressEl.style.height = "100%";
      return;
    }
    const rect = timeline.getBoundingClientRect();
    const viewportMid = window.innerHeight * 0.55;
    const progress = Math.min(1, Math.max(0, (viewportMid - rect.top) / rect.height));
    progressEl.style.height = progress * 100 + "%";
  }
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  if (window.numeriqLenis) window.numeriqLenis.on("scroll", onScroll);
  updateProgress();

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
    { threshold: 0, rootMargin: "-40% 0px -40% 0px" }
  );
  steps.forEach((step) => io.observe(step));
})();