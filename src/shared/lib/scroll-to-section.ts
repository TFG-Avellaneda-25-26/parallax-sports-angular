/**
 * Smoothly scrolls a section into view. Uses the browser's native
 * `scrollIntoView` so it automatically targets the correct scroll ancestor
 * (window or a flex/grid inner container) — GSAP's ScrollToPlugin needs the
 * exact scroll container as its target which is brittle for nested layouts.
 */
export function scrollToSection(target: HTMLElement): void {
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
