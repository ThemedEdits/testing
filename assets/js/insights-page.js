/* ==========================================================================
   INSIGHTS PAGE — renders the featured article and the full grid from
   window.NUMERIQ_BLOGS (assets/js/blog-data.js), and wires up the
   client-side category filter.
   ========================================================================== */
(function () {
  const featureMount = document.querySelector("[data-insight-feature]");
  const gridMount = document.querySelector("[data-insights-grid]");
  const emptyState = document.querySelector("[data-insights-empty]");
  const filterBar = document.querySelector("[data-insights-filter]");

  const posts = Array.isArray(window.NUMERIQ_BLOGS) ? window.NUMERIQ_BLOGS.slice() : [];
  if (!posts.length || !featureMount || !gridMount) return;

  posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  const featured = posts[0];
  const rest = posts.slice(1);

  const CATEGORY_SLUGS = {
    "Accounting": "accounting",
    "Financial Reporting": "financial-reporting",
    "Planning & Forecasting": "planning-forecasting",
    "Business Finance": "business-finance",
    "CFO Insights": "cfo-insights",
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (s) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[s]));
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  /* ---------------- Featured article ---------------- */
  featureMount.innerHTML = `
    <div class="insight-feature__media" data-fallback="${escapeHtml(featured.category)}">
      <img src="${featured.cover}" alt="${escapeHtml(featured.title)}" class="insight-feature__img" loading="lazy">
    </div>
    <div class="insight-feature__body">
      <span class="insight-feature__category">${escapeHtml(featured.category)}</span>
      <h2 class="insight-feature__title">${escapeHtml(featured.title)}</h2>
      <p class="insight-feature__excerpt">${escapeHtml(featured.excerpt)}</p>
      <span class="insight-feature__meta">${formatDate(featured.publishedAt)} &middot; ${escapeHtml(featured.readTime)}</span>
      <a href="/insights/${featured.id}/" class="insight-link">
        Read Insight
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    </div>
  `;

  const featureImg = featureMount.querySelector(".insight-feature__img");
  const featureMedia = featureMount.querySelector(".insight-feature__media");
  const markFeatureBroken = () => featureMedia.classList.add("is-broken");
  if (featureImg.complete && featureImg.naturalWidth === 0) markFeatureBroken();
  featureImg.addEventListener("error", markFeatureBroken);

  /* ---------------- Grid ---------------- */
  gridMount.innerHTML = rest
    .map((post, i) => {
      const slug = CATEGORY_SLUGS[post.category] || "all";
      return `
        <div class="insight-card-wrapper reveal reveal--up" data-category="${slug}" style="--reveal-delay:${(i % 3) * 0.06}s">
        <a href="/insights/${post.id}/" class="insight-card" data-category="${slug}">
          <div class="insight-card__media" data-fallback="${escapeHtml(post.category)}">
            <img src="${post.cover}" alt="${escapeHtml(post.title)}" loading="lazy">
          </div>
          <div class="insight-card__body">
            <span class="insight-card__category">${escapeHtml(post.category)}</span>
            <h3 class="insight-card__title">${escapeHtml(post.title)}</h3>
            <p class="insight-card__excerpt">${escapeHtml(post.excerpt)}</p>
            <span class="insight-link">
              Read Insight
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span class="insight-card__meta">${formatDate(post.publishedAt)} &middot; ${escapeHtml(post.readTime)}</span>
          </div>
        </a>
        </div>
      `;
    })
    .join("");

  gridMount.querySelectorAll(".insight-card__media").forEach((media) => {
    const img = media.querySelector("img");
    const markBroken = () => media.classList.add("is-broken");
    if (img.complete && img.naturalWidth === 0) markBroken();
    img.addEventListener("error", markBroken);
  });

  /* ---------------- Category filter ---------------- */
  if (filterBar) {
    const buttons = Array.from(filterBar.querySelectorAll("[data-filter]"));
    const cards = Array.from(gridMount.querySelectorAll(".insight-card-wrapper"));

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        buttons.forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-selected", String(b === btn));
        });

        let visibleCount = 0;
        cards.forEach((card) => {
          const matches = filter === "all" || card.dataset.category === filter;
          card.classList.toggle("is-filtered-out", !matches);
          if (matches) visibleCount++;
        });

        if (emptyState) emptyState.hidden = visibleCount > 0;
      });
    });
  }
})();