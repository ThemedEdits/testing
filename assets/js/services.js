/* ==========================================================================
   SERVICES PAGE — category tab switching + deep linking.
   Tab-switch behavior mirrors the homepage's services-tabs widget (that
   copy lives in home.js, which is landing-page scoped and isn't loaded
   here, so it's reimplemented against the same markup/classes).

   Deep linking: /services/?service=<slug> selects the right category
   and scrolls to that specific service — used by header/footer links.
   ========================================================================== */
(function () {
  const nav = document.querySelector(".services-switcher .services-tabs__nav");
  const slider = nav && nav.querySelector(".services-tabs__slider");
  const buttons = nav ? Array.from(nav.querySelectorAll(".services-tabs__btn")) : [];
  const panels = Array.from(document.querySelectorAll(".services-tabs__panel"));

  if (!nav || !buttons.length || !panels.length) return;

  let revealRun = 0;

  function revealPanel(panel) {
    const revealItems = Array.from(panel.querySelectorAll(".reveal"));
    const run = ++revealRun;

    revealItems.forEach((item) => item.classList.remove("is-visible"));

    requestAnimationFrame(() => {
      revealItems.forEach((item, index) => {
        window.setTimeout(() => {
          if (run === revealRun) item.classList.add("is-visible");
        }, index * 100);
      });
    });
  }

  function activateTab(tabName, { instant = false } = {}) {
    buttons.forEach((btn) => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });
    panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === tabName));

    const activePanel = panels.find((panel) => panel.dataset.panel === tabName);
    if (activePanel) revealPanel(activePanel);

    if (slider) {
      if (instant) {
        slider.style.transition = "none";
        slider.dataset.active = tabName;
        // force reflow so the transition:none actually applies before re-enabling
        void slider.offsetWidth;
        slider.style.transition = "";
      } else {
        slider.dataset.active = tabName;
      }
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });

  /* ---------------- Deep link: /services/?service=slug ---------------- */
  const params = new URLSearchParams(window.location.search);
  const targetSlug = params.get("service") || (window.location.hash ? window.location.hash.slice(1) : null);

  if (targetSlug) {
    const target = document.getElementById(targetSlug);
    if (target) {
      const panel = target.closest(".services-tabs__panel");
      if (panel) activateTab(panel.dataset.panel, { instant: true });

      const scrollToTarget = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (window.numeriqLenis) {
              window.numeriqLenis.scrollTo(target, {
                offset: -120,
                duration: 3.2,
                easing: (t) => {
                  return t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
                }
              });
            } else {
              target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            target.classList.add("is-highlighted");
            setTimeout(() => target.classList.remove("is-highlighted"), 2200);
          });
        });
      };

      // the page-transition curtain keeps scroll locked/Lenis stopped until
      // it finishes — scrolling before that is silently ignored, so wait for it
      if (document.documentElement.classList.contains("transition-ready")) {
        scrollToTarget();
      } else {
        document.addEventListener("numeriq:transition-complete", scrollToTarget, { once: true });
      }
    }
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