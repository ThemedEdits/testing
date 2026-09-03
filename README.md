# Numeriq Global — Website (Phase 1)

## What's in this phase
- Full core system: design tokens, reset, typography, header (with scrolled
  state), footer, buttons, form styles, scrollbar styling.
- **Page transition engine** — curtain rises → bar-chart grows upward →
  curtain drops away. Same choreography plays on every page load and on
  every internal link click, so it feels like one continuous system.
- **Reveal-on-scroll engine** — add `class="reveal" data-reveal="up|down|left|right|scale|fade"`
  to any element and it will animate in once, the first time it scrolls
  into view, and only after the page-transition has fully completed.
  Built with CSS `animation` (not `transition`), so it can never collide
  with an element's own hover/focus transition.
- **Lenis smooth scrolling**, resistance-free ease-out curve, wired to the
  header scroll state and to the transition/mobile-nav scroll lock.
- **Scroll lock** — `html.is-locked` freezes the page (no `position:fixed`
  hacks, so there is zero layout jump) during transitions and while the
  mobile menu is open.
- Landing page hero section, matched to the supplied reference design.
- A sample `/about/` page proving the shared system (header, footer,
  transitions, reveal, section-heading component) works identically
  across pages.

## Structure
```
numeriq-global/
├── index.html              → landing page
├── about/
│   └── index.html          → sample inner page
├── assets/
│   ├── css/
│   │   ├── main.min.css        → EVERYTHING shared: tokens, reset, header,
│   │   │                      footer, buttons, forms, reveal engine,
│   │   │                      page-transition engine, utilities
│   │   ├── home.css        → landing-page-only styles (hero, tile grid)
│   │   └── about.css       → about-page-only styles
│   ├── js/
│   │   ├── lenis.js    → smooth-scroll library (vendored, offline)
│   │   ├── transition.js   → page-transition choreography
│   │   ├── main.js         → Lenis init, header state, mobile nav, reveal observer
│   │   └── home.js         → hero tile-grid generator + image fallback
│   └── images/
│       ├── logo.svg / logo-32/64/180/256/512.png  → your logo, trimmed + resized
│       └── hero-team.webp  → ⚠️ NOT included — drop your transparent
│                              founders photo here, this exact filename,
│                              and the hero will pick it up automatically
│                              (a placeholder note shows until you do).
└── README.md
```

## Adding the hero photo
Save your transparent WebP as `assets/images/hero-team.webp`. The image is
deliberately taller than the gradient panel behind it (see `.hero__portrait`
in `assets/css/home.css`) — it's bottom-aligned to the panel and allowed to
overflow the top, exactly like the reference.

## How every future page should be wired up
1. Copy the `<head>` block, header, mobile nav, and footer markup from
   `about/index.html` (adjust relative paths for the folder depth).
2. Link `main.min.css` + a page-specific stylesheet (e.g. `services.css`).
3. Add `class="reveal" data-reveal="…"` to anything that should animate in.
4. Use `.section`, `.container`, and `.section-head` for consistent spacing
   and heading sizing — every section heading in the site should reuse
   `.section-head > h2 + p`.
5. Load scripts in this order at the end of `<body>`: `lenis.js` →
   `transition.js` → `main.js` → (optional page-specific script).

## Notes
- Colour palette and gradient were extracted directly from your logo:
  navy `#0A2540`, brand green `#00A86B`, mint background `#E7FBF1`.
- Headings use **Lora**, body copy uses **Manrope** — both loaded via
  Google Fonts in each page's `<head>`.
- `h1`–`h6` all have fixed, fluid (`clamp()`) sizes defined once in
  `main.min.css`, so heading sizing stays consistent site-wide by default.
- Just open `index.html` (or `about/index.html`) directly in a browser —
  no build step or local server required.

Send over the next section's design whenever you're ready and I'll build
it into this same system.
