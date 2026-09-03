/* ==========================================================================
   NUMERIQ GLOBAL — SITE CORE
   Lenis smooth scroll, header scroll-state, mobile nav, reveal-on-scroll.
   ========================================================================== */

(function () {
  "use strict";

  const root = document.documentElement;

  /* -------------------- Lenis smooth scroll -------------------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4), // resistance-free ease-out quart
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.15,
      normalizeWheel: true,
    });
    window.numeriqLenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Recalculate after late-loading assets change the document height.
    window.addEventListener("load", () => lenis.resize(), { once: true });

    const startLenis = () => {
      lenis.resize();
      lenis.start();
    };

    if (root.classList.contains("transition-ready")) {
      startLenis();
    } else {
      lenis.stop();
      document.addEventListener("numeriq:transition-complete", startLenis, { once: true });
    }
  }

  /* Smooth-scroll same-page anchor links via Lenis */
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -64, duration: 1.2 });
    else target.scrollIntoView({ behavior: "smooth" });
  });

  /* -------------------- Header scrolled state -------------------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const THRESHOLD = 14;
    let ticking = false;
    const setState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(setState);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    if (lenis) lenis.on("scroll", onScroll);
    setState();
  }

  /* -------------------- Mobile nav -------------------- */
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".nav-mobile");
  const siteHeader = document.querySelector(".site-header");
  let menuScrollY = 0;

  function setMenuOrigin() {
    if (!toggle || !mobileNav) return;
    const rect = toggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    mobileNav.style.setProperty("--menu-origin-x", `${x}px`);
    mobileNav.style.setProperty("--menu-origin-y", `${y}px`);
    if (!mobileNav.classList.contains("is-open")) {
      mobileNav.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    }
    return { x, y };
  }

  function openNav() {
    menuScrollY = lenis ? lenis.scroll : window.scrollY;
    const origin = setMenuOrigin();
    if (lenis) lenis.stop();
    mobileNav.classList.remove("is-closing");
    mobileNav.style.clipPath = `circle(0px at ${origin.x}px ${origin.y}px)`;
    mobileNav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    if (siteHeader) siteHeader.classList.add("mobile-menu-open");
    requestAnimationFrame(() => {
      mobileNav.style.clipPath = `circle(150vmax at ${origin.x}px ${origin.y}px)`;
    });
  }

  // Seed the closed state before the first possible click after navigation.
  setMenuOrigin();
  document.addEventListener("numeriq:transition-complete", setMenuOrigin);

  function closeNav() {
    mobileNav.classList.remove("is-open");
    mobileNav.classList.add("is-closing");
    toggle.setAttribute("aria-expanded", "false");
    if (siteHeader) siteHeader.classList.remove("mobile-menu-open");
    if (lenis) {
      lenis.scrollTo(menuScrollY, { immediate: true, force: true });
      lenis.start();
    }
    const finishClose = (event) => {
      if (event.propertyName !== "clip-path") return;
      mobileNav.classList.remove("is-closing");
      if (siteHeader) siteHeader.classList.remove("mobile-menu-open");
      mobileNav.removeEventListener("transitionend", finishClose);
    };
    mobileNav.addEventListener("transitionend", finishClose);
    requestAnimationFrame(() => {
      const x = mobileNav.style.getPropertyValue("--menu-origin-x");
      const y = mobileNav.style.getPropertyValue("--menu-origin-y");
      mobileNav.style.clipPath = `circle(0px at ${x} ${y})`;
    });
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });
    mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
    window.addEventListener("resize", setMenuOrigin, { passive: true });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) closeNav();
    });
  }

  /* -------------------- Reveal-on-scroll -------------------- */
  // stagger index for grouped children (used by CSS var --reveal-index)
  document.querySelectorAll(".reveal-group").forEach((group) => {
    Array.from(group.children).forEach((child, i) => child.style.setProperty("--reveal-index", i));
  });

  function initReveal() {
    const revealEls = Array.from(document.querySelectorAll(".reveal")).filter((el) => {
      const servicesPanel = el.closest('.services-tabs__panel');
      return !servicesPanel || servicesPanel.classList.contains('active');
    });

    if (!revealEls.length) return;
    const viewportHeight = window.innerHeight || 800;

    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportHeight) {
        el.classList.add("is-visible");
      }
    });

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.52, rootMargin: "0px" }
    );

    revealEls.forEach((el) => {
      if (!el.classList.contains("is-visible")) {
        io.observe(el);
      }
    });

    revealEls.forEach((el) => {
      if (!el.classList.contains("is-visible")) {
        io.observe(el);
      }
    });
  }

  // reveal immediately for LCP and on transition complete
  initReveal();
  if (!root.classList.contains("transition-ready")) {
    document.addEventListener("numeriq:transition-complete", initReveal, { once: true });
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  const headings = document.querySelectorAll('.dropdown-menu__heading');
  headings.forEach(heading => {
    const handler = function (e) {
      const category = this.dataset.category;
      const container = this.closest('.dropdown-menu__container');
      container.querySelectorAll('.dropdown-menu__heading').forEach(h => h.classList.remove('active'));
      container.querySelectorAll('.dropdown-menu__list').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const list = container.querySelector(`.dropdown-menu__list[data-category="${category}"]`);
      if (list) list.classList.add('active');
    };
    heading.addEventListener('mouseenter', handler);
    if (window.innerWidth <= 768) {
      heading.addEventListener('click', handler);
    }
  });
});

// FAQ accordion
document.addEventListener('DOMContentLoaded', function () {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!button || !answer) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach((faqItem) => {
        const faqButton = faqItem.querySelector('.faq-question');
        const faqAnswer = faqItem.querySelector('.faq-answer');

        faqItem.classList.remove('is-open');
        faqButton?.setAttribute('aria-expanded', 'false');
        faqAnswer?.setAttribute('aria-hidden', 'true');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
      }
    });
  });
});



// Trust section reveal
document.addEventListener('DOMContentLoaded', function () {
  const trustCards = document.querySelectorAll('.trust-card');
  trustCards.forEach((card, index) => {
    card.style.setProperty('--reveal-delay', `${index * 80}ms`);
  });
});


/* ==========================================================================
   FLOATING ACTIONS — WhatsApp fade-in + back-to-top with a "sticky" scroll
   (slow start, fast middle, slow finish — easeInOutQuint).
   ========================================================================== */
(function () {
  const wrap = document.querySelector("[data-floating-actions]");
  if (!wrap) return;

  const whatsapp = wrap.querySelector(".floating-btn--whatsapp");
  const topBtn = wrap.querySelector("[data-back-to-top]");
  const root = document.documentElement;

  /* WhatsApp appears once the page-transition has fully resolved */
  function showWhatsapp() { whatsapp.classList.add("is-visible"); }
  if (root.classList.contains("transition-ready")) showWhatsapp();
  else document.addEventListener("numeriq:transition-complete", showWhatsapp, { once: true });

  /* Back-to-top appears after scrolling past a threshold */
  const THRESHOLD = 480;
  let ticking = false;
  function update() {
    ticking = false;
    topBtn.classList.toggle("is-visible", window.scrollY > THRESHOLD);
  }
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  if (window.numeriqLenis) window.numeriqLenis.on("scroll", onScroll);
  update();

  /* "Sticky" scroll: almost no movement for a long stretch, a short sharp
     burst around the 55–60% mark, then almost no movement again — a
     steep logistic sigmoid, not a standard ease-in-out.
     Tune STEEPNESS (higher = snappier/shorter burst, flatter slow phases)
     and CENTER (where the burst sits, as a fraction of the timeline). */
  function easeSticky(t) {
    const STEEPNESS = 19;
    const CENTER = 0.68;
    const raw = (x) => 1 / (1 + Math.exp(-STEEPNESS * (x - CENTER)));
    const min = raw(0);
    const max = raw(1);
    return (raw(t) - min) / (max - min);
  }

  topBtn.addEventListener("click", () => {
    if (window.numeriqLenis) {
      window.numeriqLenis.scrollTo(0, { duration: 2.4, easing: easeSticky });
      return;
    }
    // fallback if Lenis isn't active
    const startY = window.scrollY;
    const duration = 2400;
    let startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      const t = Math.min(1, (ts - startTime) / duration);
      window.scrollTo(0, startY * (1 - easeSticky(t)));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
})();