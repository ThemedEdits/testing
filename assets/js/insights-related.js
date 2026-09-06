/* ==========================================================================
   INSIGHTS RELATED - Populate related posts on blog detail pages
   ========================================================================== */

(function () {
  'use strict';

  const container = document.getElementById('relatedInsights');
  if (!container || !window.NUMERIQ_BLOGS) return;

  // Get current page slug from URL
  const pathParts = window.location.pathname.split('/');
  const currentSlug = pathParts[pathParts.length - 2] || '';

  // Find current post
  const currentPost = window.NUMERIQ_BLOGS.find(post => post.id === currentSlug);
  if (!currentPost) return;

  // Find related posts in the same category, excluding the current post.
  const related = window.NUMERIQ_BLOGS
    .filter(post => post.id !== currentSlug && post.category === currentPost.category)
    .slice(0, 3);

  // --- Empty State ---
  if (related.length === 0) {
    container.innerHTML = `
      <div class="empty-related reveal-group">
        <div class="reveal empty-related__icon" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none">
            <!-- Decorative compass/map icon -->
            <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
            <circle cx="32" cy="32" r="20" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
            <circle cx="32" cy="32" r="12" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
            <path d="M32 4L32 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
            <path d="M32 52L32 60" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
            <path d="M4 32L12 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
            <path d="M52 32L60 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
            <circle cx="32" cy="32" r="4" fill="var(--color-green-500)" opacity="0.15"/>
          </svg>
        </div>
        <h4 class="reveal empty-related__title">More Insights Coming</h4>
        <p class="reveal empty-related__desc">
          We're constantly adding new content to help you build better financial operations. 
          Check back soon for more insights from this category.
        </p>
        <div class="reveal">
        <a href="/insights/" class="btn btn--outline btn--sm empty-related__cta">
          <span class="btn__text">Explore All Insights</span>
          <span class="btn__icon">
            <svg class="btn__icon-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg class="btn__icon-next" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </a></div>
      </div>
    `;
    return;
  }

  // Render related posts with reveal wrapper
  container.innerHTML = related.map((post, index) => `
    <div class="reveal" style="--reveal-delay:${index * 0.15}s">
      <a href="/insights/${post.id}/" class="related-card">
        <div class="related-card__media">
          <img src="${post.cover}" alt="${post.title}" class="related-card__img" loading="lazy" width="400" height="250" onerror="this.closest('.related-card__media').classList.add('is-broken')">
        </div>
        <div class="related-card__body">
          <span class="related-card__tag">${post.category}</span>
          <h3 class="related-card__title">${post.title}</h3>
          <span class="related-card__read-time">${post.readTime}</span>
        </div>
      </a>
    </div>
  `).join('');

  // Trigger reveal animation after a small delay
  setTimeout(() => {
    container.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('is-visible');
    });
  }, 100);

})();