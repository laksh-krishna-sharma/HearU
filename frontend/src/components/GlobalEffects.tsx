import { useEffect, useRef } from "react";

/**
 * GlobalEffects
 * - Sets up parallax + float RAF loop for any element with [data-parallax]
 * - Sets up IntersectionObserver for elements with .reveal-on-scroll
 */
export default function GlobalEffects() {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Parallax + float
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));

    const tick = (t: number) => {
      const time = t / 1000;

      parallaxEls.forEach((el) => {
        const speed = Number(el.dataset.speed ?? 0.06);
        const amp = Number(el.dataset.amp ?? 12);
        const phase = Number(el.dataset.phase ?? 0);

        const rect = el.getBoundingClientRect();
        const positionFactor = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const parallaxY = -window.scrollY * speed * (1 - Math.abs(positionFactor)) * 0.4;

        const floatY = Math.sin(time * (0.8 + speed * 2) + phase) * amp;
        const floatX = Math.sin(time * (0.6 + speed) + phase / 2) * (amp / 6);

        el.style.transform = `translate3d(${floatX.toFixed(2)}px, ${(parallaxY + floatY).toFixed(2)}px, 0)`;
        const rot = (Math.sin(time + phase) * speed * 2).toFixed(2);
        el.style.willChange = "transform";
        el.style.transform += ` rotate(${rot}deg)`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // Reveal-on-scroll
    const inviewCb: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add("in-view");
        }
      });
    };
    const observer = new IntersectionObserver(inviewCb, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    document.querySelectorAll<HTMLElement>(".reveal-on-scroll").forEach((el) => {
      (el as HTMLElement).style.transition = "opacity 700ms cubic-bezier(.2,.9,.25,1), transform 700ms";
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(24px)";
      observer.observe(el);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return null;
}
