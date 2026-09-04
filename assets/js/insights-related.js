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

  if (related.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--color-ink-muted);">No related insights found.</p>';
    return;
  }

  // Render related posts
  container.innerHTML = related.map(post => `
    <a href="/insights/${post.id}/" class="related-card reveal">
      <div class="related-card__media">
        <img src="${post.cover}" alt="${post.title}" class="related-card__img" loading="lazy" width="400" height="250">
      </div>
      <div class="related-card__body">
        <span class="related-card__tag">${post.category}</span>
        <h3 class="related-card__title">${post.title}</h3>
        <span class="related-card__read-time">${post.readTime}</span>
      </div>
    </a>
  `).join('');

})();