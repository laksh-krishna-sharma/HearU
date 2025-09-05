// components/grit-illustrations.tsx
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface IllustrationProps {
  className?: string;
  style?: React.CSSProperties;
}

export function CloudEye({ className = "", style }: IllustrationProps) {
  return (
    <div className={`absolute ${className}`} style={style}>
      <svg width="80" height="60" viewBox="0 0 80 60" className="text-grit-white/80">
        <path
          d="M15 35c-8 0-15-7-15-15s7-15 15-15c2 0 4 0.5 5.5 1.5C23 2.5 28 0 33.5 0S44 2.5 46.5 6.5c1.5-1 3.5-1.5 5.5-1.5 8 0 15 7 15 15s-7 15-15 15H15z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="35" cy="25" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="35" cy="25" r="4" fill="currentColor" />
        <path d="M20 45 L25 55 M30 45 L35 55 M40 45 L45 55 M50 45 L55 55" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function SkullIcon({ className = "", style }: IllustrationProps) {
  return (
    <div className={`absolute ${className}`} style={style}>
      <svg width="60" height="70" viewBox="0 0 60 70" className="text-grit-white/80">
        <path
          d="M30 5C20 5 12 13 12 23v15c0 8 4 15 10 19v8c0 2 2 4 4 4h8c2 0 4-2 4-4v-8c6-4 10-11 10-19V23c0-10-8-18-18-18z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="22" cy="28" r="3" fill="currentColor" />
        <circle cx="38" cy="28" r="3" fill="currentColor" />
        <path d="M25 40 L30 45 L35 40" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M20 50 L25 55 M30 50 L30 55 M35 50 L35 55 M40 50 L35 55" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function UFOIcon({ className = "", style }: IllustrationProps) {
  return (
    <div className={`absolute ${className}`} style={style}>
      <svg width="90" height="50" viewBox="0 0 90 50" className="text-grit-white/80">
        <ellipse cx="45" cy="35" rx="40" ry="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="45" cy="20" rx="25" ry="15" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="35" cy="20" r="2" fill="currentColor" />
        <circle cx="45" cy="18" r="2" fill="currentColor" />
        <circle cx="55" cy="20" r="2" fill="currentColor" />
        <path d="M20 45 L25 50 M35 45 L40 50 M50 45 L55 50 M65 45 L70 50" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function EyeIcon({ className = "", style }: IllustrationProps) {
  return (
    <div className={`absolute ${className}`} style={style}>
      <svg width="60" height="40" viewBox="0 0 60 40" className="text-grit-white/80">
        <ellipse cx="30" cy="20" rx="25" ry="15" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="20" r="4" fill="currentColor" />
        <path d="M5 20 Q15 10 30 20 Q45 10 55 20" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function CharacterIcon({ className = "", style }: IllustrationProps) {
  return (
    <div className={`absolute ${className}`} style={style}>
      <svg width="50" height="80" viewBox="0 0 50 80" className="text-grit-white/80">
        <circle cx="25" cy="15" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M25 25 L25 55" stroke="currentColor" strokeWidth="2" />
        <path d="M25 35 L15 45 M25 35 L35 45" stroke="currentColor" strokeWidth="2" />
        <path d="M25 55 L15 70 M25 55 L35 70" stroke="currentColor" strokeWidth="2" />
        <circle cx="22" cy="12" r="1" fill="currentColor" />
        <circle cx="28" cy="12" r="1" fill="currentColor" />
        <path d="M20 18 Q25 22 30 18" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

/**
 * ParticleField
 * - Generates random particles (dots)
 * - Each particle has a randomized speed and initial top position (px)
 * - On scroll we move particles UP by scrollY * speed (so user scrolling down makes dots go up)
 * - Particles wrap when they go off top for continuous motion
 */
export function ParticleField() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<
    Array<{
      id: number;
      left: number; // percentage
      top: number; // px initial
      speed: number; // multiplier for scroll
      size: number; // px
      node?: HTMLDivElement | null;
    }>
  >([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const viewportH = window.innerHeight;
    // create particles
    const particleCount = Math.max(20, Math.floor(window.innerWidth / 80)); // scale with width
    const p = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * viewportH,
      speed: 0.1 + Math.random() * 0.6, // 0.1 .. 0.7
      size: 1 + Math.random() * 3, // px
      node: undefined as HTMLDivElement | undefined,
    }));
    particlesRef.current = p;

    let lastScroll = window.scrollY;

    function update() {
      const scrollY = window.scrollY;
      const diff = scrollY - lastScroll;
      lastScroll = scrollY;

      const vh = window.innerHeight;
      particlesRef.current.forEach((part) => {
        const el = part.node;
        if (!el) return;
        // compute newTop: initial top - scrollY * speed
        const rawTop = part.top - scrollY * part.speed;
        // wrap: if off the top -> move to bottom + small offset
        let topWrapped = rawTop;
        if (rawTop < -20) {
          topWrapped = vh + (rawTop % vh);
          // also update the stored initial position so wrapping continues consistently
          part.top = topWrapped + scrollY * part.speed;
        }
        // apply style
        el.style.top = `${topWrapped}px`;
        el.style.left = `${part.left}%`;
        el.style.width = `${part.size}px`;
        el.style.height = `${part.size}px`;
        // small horizontal micro drift using CSS transform for organic motion
        const sway = Math.sin((scrollY + part.id * 37) * 0.002 + part.left) * 6 * (part.speed);
        el.style.transform = `translateX(${sway}px)`; // no Y here because we set top
      });

      rafRef.current = requestAnimationFrame(update);
    }

    rafRef.current = requestAnimationFrame(update);

    // handle resize: recalc viewport and reposition if needed
    function onResize() {
      const vh2 = window.innerHeight;
      particlesRef.current.forEach((part) => {
        if (part.top > vh2) part.top = Math.random() * vh2;
      });
    }
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // render particles and attach refs so the RAF loop can mutate them directly
  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {particlesRef.current.length === 0
        ? null
        : particlesRef.current.map((part) => (
            <div
              key={part.id}
              ref={(el) => {
                if (el) {
                  part.node = el;
                  // initialize styles (so they appear immediately)
                  el.style.position = "absolute";
                  el.style.top = `${part.top}px`;
                  el.style.left = `${part.left}%`;
                  el.style.width = `${part.size}px`;
                  el.style.height = `${part.size}px`;
                  el.style.borderRadius = "50%";
                  el.style.background = "rgba(255,255,255,0.7)";
                  el.style.opacity = String(0.5 + Math.random() * 0.8);
                  el.style.filter = "blur(0.2px)";
                  el.style.transition = "opacity 0.8s ease";
                  el.className = "particle-drift will-change-transform";
                } else {
                  part.node = undefined;
                }
              }}
            />
          ))}
    </div>
  );
}
