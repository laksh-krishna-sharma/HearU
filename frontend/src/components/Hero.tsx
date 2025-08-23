
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { pageTransitions, floatingAnimation, createTimeline } from '../utils/animations';

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create main animation timeline
    const tl = createTimeline({ delay: 0.2 });

    // Animate hero elements in sequence
    if (titleRef.current) {
      tl.add(pageTransitions.fadeInUp(titleRef.current, 0))
        .add(pageTransitions.fadeInUp(subtitleRef.current!, 0.2), "-=0.3")
        .add(pageTransitions.fadeInScale(ctaRef.current!, 0.3), "-=0.2")
        .add(pageTransitions.fadeInUp(indicatorsRef.current!, 0.4), "-=0.1");
    }

    // Animate floating particles
    const particles = particlesRef.current?.children;
    if (particles) {
      Array.from(particles).forEach((particle, index) => {
        floatingAnimation(particle, {
          y: -30 + Math.random() * 20,
          x: -10 + Math.random() * 20,
          duration: 4 + Math.random() * 2,
          delay: index * 0.5,
          ease: "sine.inOut"
        });
      });
    }

    // Smooth scroll animation for the scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      });
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background with Wave Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-background via-blue-50 to-green-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-ocean-secondary to-ocean-primary rounded-full mix-blend-multiply filter blur-xl animate-wave"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-ocean-accent to-ocean-primary rounded-full mix-blend-multiply filter blur-xl animate-wave" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-ocean-secondary to-ocean-accent rounded-full mix-blend-multiply filter blur-xl animate-wave" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-ocean-primary bg-opacity-40 rounded-full"></div>
        <div className="absolute top-32 right-32 w-6 h-6 bg-ocean-secondary bg-opacity-30 rounded-full"></div>
        <div className="absolute bottom-40 left-40 w-3 h-3 bg-ocean-accent bg-opacity-50 rounded-full"></div>
        <div className="absolute top-1/2 right-20 w-5 h-5 bg-ocean-primary bg-opacity-35 rounded-full"></div>
        <div className="absolute bottom-20 right-1/4 w-4 h-4 bg-ocean-secondary bg-opacity-40 rounded-full"></div>
        <div className="absolute top-40 left-1/3 w-2 h-2 bg-ocean-accent bg-opacity-60 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-ocean-text mb-6 leading-tight opacity-0"
        >
          You're Not Alone in This
          <span className="block text-ocean-primary mt-2">Journey</span>
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-lg md:text-xl lg:text-2xl text-ocean-text opacity-0 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          HearU is here to support you through difficult times. Connect with caring professionals, 
          find resources, and discover that healing is possible. Your mental wellness matters.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0">
          <Link 
            to="/signup"
            className="px-8 py-4 md:px-10 md:py-5 text-lg md:text-xl font-semibold text-white bg-ocean-primary rounded-xl transition-all duration-300 hover:bg-ocean-accent hover:scale-105 focus:outline-none focus:ring-4 focus:ring-ocean-primary focus:ring-opacity-50 shadow-lg text-center inline-block transform hover:shadow-2xl"
          >
            Get Started Today
          </Link>
          
          <p className="text-sm md:text-base text-ocean-text opacity-70 mt-2 sm:mt-0">
            Free • Confidential • Available 24/7
          </p>
        </div>

        {/* Trust Indicators */}
        <div 
          ref={indicatorsRef}
          className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-ocean-text opacity-0"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-ocean-primary rounded-full animate-pulse"></div>
            <span>Licensed Professionals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-ocean-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span>Crisis Support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-ocean-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span>Youth Focused</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer scroll-indicator hover:scale-110 transition-transform duration-300">
        <div className="w-6 h-10 border-2 border-ocean-primary rounded-full flex justify-center hover:border-ocean-secondary transition-colors duration-300">
          <div className="w-1 h-3 bg-ocean-primary rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;