import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { pageTransitions, createTimeline } from "../utils/animations";
import {
  CloudEye,
  SkullIcon,
  UFOIcon,
  EyeIcon,
  CharacterIcon,
  ParticleField,
} from "@/components/grit-illustrations";

const Hero = () => {
  const ovalRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // requestAnimationFrame handle
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // initial page timeline (keeps your previous timeline)
    const tl = createTimeline({ delay: 0.2 });
    if (ovalRef.current) {
      tl.add(pageTransitions.fadeInScale(ovalRef.current, 0.35));
    }

    // staggered reveal for hero text/buttons (fallback if you don't use GSAP)
    const staggerNodes = document.querySelectorAll<HTMLElement>(".stagger-reveal");
    staggerNodes.forEach((el, i) => {
      el.style.transition = "opacity 600ms cubic-bezier(.2,.9,.25,1), transform 600ms";
      el.style.transitionDelay = `${i * 80 + 120}ms`;
      el.style.opacity = "0";
      el.style.transform = "translateY(10px) scale(.995)";
      // trigger on next tick:
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0) scale(1)";
      });
    });

    // PARALLAX + FLOAT loop
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let lastScrollY = window.scrollY;
    let t0 = performance.now();

    const tick = (t: number) => {
      const scrollY = window.scrollY;
      const dt = t - t0;
      t0 = t;

      // a normalized time for sine wave movement
      const time = t / 1000;

      parallaxEls.forEach((el) => {
        const speed = Number(el.dataset.speed ?? 0.06); // how responsive to scroll (positive -> moves with, negative -> opposite)
        const amp = Number(el.dataset.amp ?? 12); // idle amplitude in px
        const phase = Number(el.dataset.phase ?? 0); // phase offset
        // parallax offset derived from scroll and element position (smoother than raw scrollY)
        const rect = el.getBoundingClientRect();
        // positionFactor makes elements near center move less abruptly
        const positionFactor = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const parallaxY = -window.scrollY * speed * (1 - Math.abs(positionFactor)) * 0.4;

        // floating sine wave
        const floatY = Math.sin(time * (0.8 + speed * 2) + phase) * amp;

        // small x wobble for natural motion
        const floatX = Math.sin(time * (0.6 + speed) + phase / 2) * (amp / 6);

        el.style.transform = `translate3d(${floatX.toFixed(2)}px, ${(parallaxY + floatY).toFixed(2)}px, 0)`;
        // subtle rotation based on speed (optional)
        const rot = (Math.sin(time + phase) * speed * 2).toFixed(2);
        el.style.willChange = "transform";
        el.style.transform += ` rotate(${rot}deg)`;
      });

      lastScrollY = scrollY;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // IntersectionObserver for "reveal-on-scroll" sections & elements
    const inviewCb: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add("in-view");
        } else {
          // keep elements visible after reveal to avoid flicker; comment out removal if you want repeat reveals
          // el.classList.remove("in-view");
        }
      });
    };
    const observer = new IntersectionObserver(inviewCb, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    document.querySelectorAll<HTMLElement>(".reveal-on-scroll").forEach((el) => {
      el.style.transition = "opacity 700ms cubic-bezier(.2,.9,.25,1), transform 700ms";
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      observer.observe(el);
    });

    // Clean up
    return () => {
      tl.kill?.();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  const handleStartJournaling = () => {
    navigate("/login");
  };

  return (
    <div className="w-full bg-black text-white">
      {/* INLINE CUSTOM CSS (keyframes + helper classes) */}
      <style>{`
        /* gentle vertical float */
        @keyframes floatY {
          0% { transform: translateY(-8px); }
          50% { transform: translateY(10px); }
          100% { transform: translateY(-8px); }
        }
        .float {
          animation-name: floatY;
          animation-duration: 6s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        /* small, faster float variant */
        .float-fast {
          animation-duration: 4.5s;
        }

        /* glow pulse helper */
        @keyframes glowPulse {
          0% { filter: drop-shadow(0 0 6px rgba(255,255,255,0.04)); opacity: 0.9; }
          50% { filter: drop-shadow(0 0 28px rgba(255,255,255,0.06)); opacity: 1; }
          100% { filter: drop-shadow(0 0 6px rgba(255,255,255,0.04)); opacity: 0.92; }
        }
        .glow-pulse {
          animation: glowPulse 3.6s ease-in-out infinite;
        }

        /* reveal-on-scroll target style */
        .reveal-on-scroll.in-view {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        /* small entrance for hero title/para/buttons when first mounted */
        .animate-slide-up {
          transform: translateY(6px);
          opacity: 0;
          transition: transform 520ms cubic-bezier(.2,.9,.25,1), opacity 520ms;
        }
        .animate-slide-up.visible {
          transform: translateY(0);
          opacity: 1;
        }

        /* subtle hover scale for floating icons (improves perceived interactivity) */
        .svg-float:hover { transform: scale(1.045) !important; transition: transform 220ms; }
      `}</style>

      {/* Hero Section */}
      <section className="h-screen w-full flex flex-col items-center justify-center text-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <ParticleField />

        {/* Floating SVG Illustrations - data-parallax controls motion behavior */}
        <CloudEye
          data-parallax
          data-speed="0.045"
          data-amp="16"
          data-phase="0"
          className="svg-float absolute top-20 left-10 float glow-pulse"
          style={{ animationDelay: "0s" }}
        />
        <UFOIcon
          data-parallax
          data-speed="-0.04"
          data-amp="22"
          data-phase="0.9"
          className="svg-float absolute top-32 right-20 float float-fast glow-pulse"
          style={{ animationDelay: "2s" }}
        />
        <SkullIcon
          data-parallax
          data-speed="0.06"
          data-amp="12"
          data-phase="1.9"
          className="svg-float absolute top-60 right-10 float glow-pulse"
          style={{ animationDelay: "4s" }}
        />
        <EyeIcon
          data-parallax
          data-speed="-0.03"
          data-amp="18"
          data-phase="0.4"
          className="svg-float absolute bottom-40 left-20 float float-fast glow-pulse"
          style={{ animationDelay: "1s" }}
        />
        <CharacterIcon
          data-parallax
          data-speed="0.05"
          data-amp="14"
          data-phase="2.6"
          className="svg-float absolute bottom-20 right-32 float glow-pulse"
          style={{ animationDelay: "3s" }}
        />
        <CloudEye
          data-parallax
          data-speed="-0.02"
          data-amp="26"
          data-phase="4.2"
          className="svg-float absolute top-[20rem] left-1/3 float glow-pulse"
          style={{ animationDelay: "5s" }}
        />
        <UFOIcon
          data-parallax
          data-speed="0.03"
          data-amp="18"
          data-phase="3.1"
          className="svg-float absolute bottom-60 left-1/4 float float-fast glow-pulse"
          style={{ animationDelay: "1.5s" }}
        />

        {/* Glow Circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-32 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        {/* Intro (set ref for timeline) */}
        <div ref={ovalRef} className="mb-6 z-10 max-w-[90%] sm:max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide mb-4 stagger-reveal">
            Welcome to Your Safe Space
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto stagger-reveal">
            Meet Eve, your AI companion for mental wellness journaling.
            She's here to listen, understand, and support your journey with compassion and care.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row gap-4 justify-center" aria-hidden={false}>
          <button
            onClick={handleStartJournaling}
            className="px-8 mb-6 py-4 rounded-2xl bg-primary text-black font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105 stagger-reveal"
            style={{ willChange: "transform, opacity" }}
          >
            CHAT WITH EVE
          </button>
          <button
            onClick={handleStartJournaling}
            className="px-8 py-4 rounded-2xl mb-6 border border-white/30 text-white hover:bg-white/10 transition-all transform hover:scale-105 stagger-reveal"
            style={{ willChange: "transform, opacity" }}
          >
            START JOURNALING
          </button>
        </div>
      </section>

      {/* About Mental Wellness Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-gradient-to-b from-black via-[#111] to-black text-left reveal-on-scroll">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-extrabold mb-8 text-primary">Why Mental Wellness Matters</h2>
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
            Mental wellness is a dynamic state of emotional, psychological, and social well-being, not merely the absence of illness.
            It enhances clarity of thought, boosts productivity, and fuels creativity. In our relationships, mental wellness is the
            bedrock, allowing us to connect authentically, manage conflict, and foster empathy. Prioritizing mental wellness is a
            lifelong practice—a fundamental commitment to living a full, vibrant, and resilient life.
          </p>
        </div>
      </section>

      {/* Journaling Benefits */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-[#111] text-center reveal-on-scroll">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-primary">The Power of Journaling</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Journaling is more than writing—it's a tool for self-discovery.
            It helps you process emotions, reflect on experiences, and gain insights into your thoughts.
            Studies show journaling reduces stress, strengthens memory, and supports emotional healing.
          </p>
        </div>
      </section>

      {/* Eve's Role */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-gradient-to-b from-[#111] to-black text-left reveal-on-scroll">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-primary">How Eve Helps You</h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Eve isn’t just an AI—she’s designed to listen with empathy.
              She guides your journaling sessions, asks thoughtful questions,
              and ensures you feel supported. Eve adapts to your journey,
              helping you reflect and grow at your own pace.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-black text-center reveal-on-scroll">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-primary">Begin Your Journey Today</h2>
        <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
          Every great change starts with one small step. Take yours today.
          Your mental wellness matters, and Eve is here to walk beside you.
        </p>
        <button
          onClick={handleStartJournaling}
          className="px-8 py-4 rounded-2xl bg-primary text-black font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105"
        >
          Start Now
        </button>
      </section>
    </div>
  );
};

export default Hero;
