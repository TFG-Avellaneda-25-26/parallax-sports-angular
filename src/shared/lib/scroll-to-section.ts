/**
 * Smoothly scrolls a section into view. Uses the browser's native
 * `scrollIntoView` so it automatically targets the correct scroll ancestor
 * (window or a flex/grid inner container) — GSAP's ScrollToPlugin needs the
 * exact scroll container as its target which is brittle for nested layouts.
 *
 * Defers through two rAFs so the destination component's DOM has both laid
 * out and painted before we measure. Without this, scrolling on a freshly
 * mounted route lands wherever the prior layout was.
 */
export function scrollToSection(target: HTMLElement): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
