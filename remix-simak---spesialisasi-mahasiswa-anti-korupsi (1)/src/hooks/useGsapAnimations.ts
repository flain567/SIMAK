import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapPageAnimations(
  containerRef: RefObject<HTMLElement | null>,
  deps: unknown[] = []
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Hero Text Stagger Entrance
      const heroTextGroups = container.querySelectorAll('[data-gsap="hero-text"]');
      heroTextGroups.forEach((group) => {
        gsap.from(group.children, {
          y: 22,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      });

      // 2. Hero Media / Card Entrance
      const heroMedia = container.querySelectorAll('[data-gsap="hero-media"]');
      heroMedia.forEach((el) => {
        gsap.from(el, {
          y: 24,
          scale: 0.97,
          opacity: 0,
          duration: 0.75,
          delay: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      });

      // 3. Animated Number Counters
      const counters = container.querySelectorAll<HTMLElement>('[data-gsap-counter]');
      counters.forEach((el) => {
        const targetVal = parseFloat(el.dataset.gsapCounter || '0');
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const useDotSeparator = el.dataset.separator === 'dot';

        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: targetVal,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true,
          },
          onUpdate: () => {
            const rounded = Math.round(counterObj.val);
            const formatted = useDotSeparator
              ? rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
              : rounded.toString();
            el.textContent = `${prefix}${formatted}${suffix}`;
          },
        });
      });

      // 4. Section Headers Reveal
      const sectionHeaders = container.querySelectorAll('[data-gsap="section-header"]');
      sectionHeaders.forEach((header) => {
        gsap.from(header, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 88%',
            once: true,
          },
          clearProps: 'transform,opacity',
        });
      });

      // 5. Staggered Grids (Misi, Program Kerja, Mitra, Alur Seleksi, FAQ, Bento, Cards)
      const staggerGrids = container.querySelectorAll('[data-gsap="stagger-grid"]');
      staggerGrids.forEach((grid) => {
        if (!grid.children.length) return;
        gsap.from(grid.children, {
          y: 26,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 86%',
            once: true,
          },
          clearProps: 'transform,opacity',
        });
      });

      // 6. Organization Leadership Tree Cascade
      const orgTree = container.querySelector('[data-gsap="org-tree"]');
      if (orgTree && orgTree.children.length) {
        gsap.from(orgTree.children, {
          y: 24,
          opacity: 0,
          scale: 0.98,
          duration: 0.55,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: orgTree,
            start: 'top 82%',
            once: true,
          },
          clearProps: 'transform,opacity',
        });
      }

      // 7. Subtle Parallax on Heritage Watermarks
      const parallaxElements = container.querySelectorAll('[data-gsap="parallax"]');
      parallaxElements.forEach((el) => {
        gsap.to(el, {
          y: 45,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function animateFilterGrid(gridElement: HTMLElement | null) {
  if (!gridElement || !gridElement.children.length) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  gsap.fromTo(
    gridElement.children,
    { y: 16, opacity: 0, scale: 0.98 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.38,
      stagger: 0.045,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
    }
  );
}
