/**
 * Optional GSAP adapter. Inject imports from the host project:
 * import { gsap } from 'gsap';
 * import { ScrollTrigger } from 'gsap/ScrollTrigger';
 * const story = initStory(root, { gsap, ScrollTrigger });
 * Cleanup: story.destroy(). Do not also native-animate the same visual.
 */
export function initStory(root, { gsap, ScrollTrigger }) {
  if (!root || !gsap || !ScrollTrigger) throw new TypeError('Supply root, gsap and ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
    root.querySelectorAll('[data-vink-story]').forEach(section => {
      const stage = section.querySelector('[data-vink-story-stage]');
      const visual = section.querySelector('[data-vink-story-visual]');
      if (!stage || !visual) return;
      gsap.fromTo(visual, { scale: .96, y: 20 }, {
        scale: 1.04, y: -20, ease: 'none',
        scrollTrigger: {
          trigger: section, start: 'top 104px', end: 'bottom bottom',
          pin: stage, pinSpacing: false, scrub: .65, invalidateOnRefresh: true,
        },
      });
    });
  }, root);
  const view = root.ownerDocument.defaultView;
  let refreshFrame = 0;
  const refresh = () => {
    view.cancelAnimationFrame(refreshFrame);
    refreshFrame = view.requestAnimationFrame(() => ScrollTrigger.refresh());
  };
  root.addEventListener('vink:layout', refresh);
  root.querySelectorAll('img').forEach(img => {
    if (!img.complete) img.addEventListener('load', refresh);
  });
  let stopped = false;
  return {
    destroy() {
      if (stopped) return;
      stopped = true;
      view.cancelAnimationFrame(refreshFrame);
      root.removeEventListener('vink:layout', refresh);
      root.querySelectorAll('img').forEach(img => img.removeEventListener('load', refresh));
      media.revert();
    },
  };
}
