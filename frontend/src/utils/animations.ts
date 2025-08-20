import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Animation easing presets
export const EASING = {
  smooth: "power2.out",
  bounce: "back.out(1.7)",
  elastic: "elastic.out(1, 0.3)",
  slow: "power1.inOut",
  fast: "power3.out"
};

// Common animation durations
export const DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,
  verySlow: 2
};

// Page transition animations
export const pageTransitions = {
  // Fade in from bottom
  fadeInUp: (element: string | Element, delay = 0) => {
    return gsap.fromTo(element, 
      { 
        opacity: 0, 
        y: 50 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: DURATION.normal,
        delay,
        ease: EASING.smooth 
      }
    );
  },

  // Fade in with scale
  fadeInScale: (element: string | Element, delay = 0) => {
    return gsap.fromTo(element,
      {
        opacity: 0,
        scale: 0.8
      },
      {
        opacity: 1,
        scale: 1,
        duration: DURATION.normal,
        delay,
        ease: EASING.bounce
      }
    );
  },

  // Stagger animation for multiple elements
  staggerIn: (elements: string | NodeListOf<Element> | Element[], delay = 0) => {
    return gsap.fromTo(elements,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.normal,
        delay,
        stagger: 0.1,
        ease: EASING.smooth
      }
    );
  },

  // Slide in from left
  slideInLeft: (element: string | Element, delay = 0) => {
    return gsap.fromTo(element,
      {
        opacity: 0,
        x: -100
      },
      {
        opacity: 1,
        x: 0,
        duration: DURATION.normal,
        delay,
        ease: EASING.smooth
      }
    );
  },

  // Slide in from right
  slideInRight: (element: string | Element, delay = 0) => {
    return gsap.fromTo(element,
      {
        opacity: 0,
        x: 100
      },
      {
        opacity: 1,
        x: 0,
        duration: DURATION.normal,
        delay,
        ease: EASING.smooth
      }
    );
  }
};

// Text reveal animations
export const textAnimations = {
  // Typewriter effect
  typewriter: (element: string | Element, text: string, delay = 0) => {
    return gsap.to(element, {
      duration: DURATION.verySlow,
      text: text,
      delay,
      ease: "none"
    });
  },

  // Split text reveal
  splitTextReveal: (element: string | Element, delay = 0) => {
    const chars = gsap.utils.toArray(`${element} .char`);
    return gsap.fromTo(chars,
      {
        opacity: 0,
        y: 50,
        rotateX: -90
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: DURATION.normal,
        delay,
        stagger: 0.02,
        ease: EASING.bounce
      }
    );
  },

  // Word by word reveal
  wordReveal: (element: string | Element, delay = 0) => {
    const words = gsap.utils.toArray(`${element} .word`);
    return gsap.fromTo(words,
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.fast,
        delay,
        stagger: 0.1,
        ease: EASING.smooth
      }
    );
  }
};

// Hover animations
export const hoverAnimations = {
  // Lift effect
  lift: (element: string | Element) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    
    if (!el) return;
    
    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        y: -8,
        scale: 1.02,
        duration: DURATION.fast,
        ease: EASING.smooth,
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        y: 0,
        scale: 1,
        duration: DURATION.fast,
        ease: EASING.smooth,
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
      });
    });
  },

  // Button press effect
  buttonPress: (element: string | Element) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    
    if (!el) return;
    
    el.addEventListener('mousedown', () => {
      gsap.to(el, {
        scale: 0.95,
        duration: 0.1,
        ease: EASING.fast
      });
    });

    el.addEventListener('mouseup', () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.1,
        ease: EASING.fast
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.1,
        ease: EASING.fast
      });
    });
  },

  // Glow effect
  glow: (element: string | Element, color = "#6BCB77") => {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    
    if (!el) return;
    
    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        boxShadow: `0 0 20px ${color}40`,
        duration: DURATION.fast,
        ease: EASING.smooth
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        boxShadow: "none",
        duration: DURATION.fast,
        ease: EASING.smooth
      });
    });
  }
};

// Scroll-triggered animations
export const scrollAnimations = {
  // Fade in when element enters viewport
  fadeInOnScroll: (element: string | Element, options = {}) => {
    return gsap.fromTo(element,
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.normal,
        ease: EASING.smooth,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          ...options
        }
      }
    );
  },

  // Scale in on scroll
  scaleInOnScroll: (element: string | Element, options = {}) => {
    return gsap.fromTo(element,
      {
        opacity: 0,
        scale: 0.5
      },
      {
        opacity: 1,
        scale: 1,
        duration: DURATION.normal,
        ease: EASING.bounce,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          ...options
        }
      }
    );
  },

  // Stagger reveal on scroll
  staggerOnScroll: (elements: string | NodeListOf<Element> | Element[], options = {}) => {
    return gsap.fromTo(elements,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.normal,
        stagger: 0.1,
        ease: EASING.smooth,
        scrollTrigger: {
          trigger: elements,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          ...options
        }
      }
    );
  },

  // Parallax effect
  parallax: (element: string | Element, speed = 0.5) => {
    return gsap.to(element, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }
};

// Counter animation
export const counterAnimation = (element: string | Element, endValue: number, duration = DURATION.slow) => {
  const obj = { value: 0 };
  const el = typeof element === 'string' ? document.querySelector(element) : element;
  
  if (!el) return;
  
  return gsap.to(obj, {
    duration,
    value: endValue,
    ease: EASING.smooth,
    onUpdate: () => {
      el.textContent = Math.floor(obj.value).toString();
    }
  });
};

// Loading animations
export const loadingAnimations = {
  // Spinner
  spinner: (element: string | Element) => {
    return gsap.to(element, {
      rotation: 360,
      duration: 1,
      ease: "none",
      repeat: -1
    });
  },

  // Pulse
  pulse: (element: string | Element) => {
    return gsap.to(element, {
      scale: 1.1,
      duration: 0.6,
      ease: EASING.smooth,
      yoyo: true,
      repeat: -1
    });
  },

  // Progress bar
  progressBar: (element: string | Element, progress: number) => {
    return gsap.to(element, {
      width: `${progress}%`,
      duration: DURATION.normal,
      ease: EASING.smooth
    });
  }
};

// Floating animation for decorative elements
export const floatingAnimation = (element: string | Element, options = {}) => {
  const defaultOptions = {
    y: -20,
    duration: 3,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    ...options
  };
  
  return gsap.to(element, defaultOptions);
};

// Create timeline for complex animations
export const createTimeline = (options = {}) => {
  return gsap.timeline(options);
};

// Cleanup function for ScrollTriggers
export const cleanupScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

// Refresh ScrollTriggers (useful after DOM changes)
export const refreshScrollTriggers = () => {
  ScrollTrigger.refresh();
};

export default {
  pageTransitions,
  textAnimations,
  hoverAnimations,
  scrollAnimations,
  counterAnimation,
  loadingAnimations,
  floatingAnimation,
  createTimeline,
  cleanupScrollTriggers,
  refreshScrollTriggers,
  EASING,
  DURATION
};
