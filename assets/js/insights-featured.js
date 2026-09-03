/* ==========================================================================
   NUMERIQ GLOBAL — FEATURED INSIGHTS RENDERER
   ========================================================================== */

(function () {
  const mount = document.querySelector("[data-featured-blogs]");
  if (!mount) return;

  const posts = Array.isArray(window.NUMERIQ_BLOGS) ? window.NUMERIQ_BLOGS.slice() : [];
  if (!posts.length) return;

  posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const featured = posts.slice(0, 4);

  const slotClasses = ["blog-card--wide", "blog-card--small", "blog-card--small", "blog-card--feature"];

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (s) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[s]));
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  mount.dataset.count = featured.length;

  mount.innerHTML = featured.map((post, i) => {
    const slotClass = slotClasses[i] || "blog-card--small";
    const isFeature = slotClass === "blog-card--feature";
    const title = escapeHtml(post.title);
    const category = escapeHtml(post.category);

    return `
      <a href="/insights/${post.id}/" class="blog-card ${slotClass} reveal" style="--reveal-delay:${i * 0.2}s">
        <div class="blog-card__media" data-fallback="${category}">
          <img src="${post.cover}" alt="${title}" class="blog-card__img" loading="lazy">
        </div>
        <div class="blog-card__body">
          <span class="blog-card__tag">${category}</span>
          <h3 class="blog-card__title">${title}</h3>
          ${isFeature ? `<p class="blog-card__excerpt">${escapeHtml(post.excerpt)}</p>` : ""}
          <div class="blog-card__author">
            <img src="${post.author.avatar}" alt="" class="blog-card__avatar" loading="lazy">
            <span>
              <strong>${escapeHtml(post.author.name)}</strong>
              ${isFeature ? `<small>${formatDate(post.publishedAt)} · ${escapeHtml(post.readTime)}</small>` : `<small>${escapeHtml(post.author.role)}</small>`}
            </span>
          </div>
        </div>
      </a>
    `;
  }).join("");

  mount.querySelectorAll(".blog-card__img").forEach((img) => {
    const markBroken = () => img.closest(".blog-card__media").classList.add("is-broken");
    if (img.complete && img.naturalWidth === 0) markBroken();
    img.addEventListener("error", markBroken);
  });

  mount.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--reveal-index", i);
  });
})();