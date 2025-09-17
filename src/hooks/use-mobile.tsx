import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

// Scroll reveal hook for staggered fade-up on elements with [data-reveal]
export function useScrollReveal(options: { rootMargin?: string } = {}) {
  React.useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            const delay = el.dataset.revealDelay || '0ms';
            el.style.animationDelay = delay;
            el.classList.add('animate-staggerFadeUp');
            observer.unobserve(el);
          }
        });
      },
      { root: null, rootMargin: options.rootMargin ?? '0px 0px -10% 0px', threshold: 0.1 }
    );

    elements.forEach((el, idx) => {
      if (!el.style.animationDelay) {
        el.style.animationDelay = `${Math.min(idx * 80, 800)}ms`;
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [options.rootMargin]);
}