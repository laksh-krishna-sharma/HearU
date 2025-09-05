import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { pageTransitions, createTimeline } from '../utils/animations';
// import { TbActivityHeartbeat } from "react-icons/tb";
import Eve from "@/components/eve/Eve";

const Hero = () => {
  const ovalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

    useEffect(() => {
    const tl = createTimeline({ delay: 0.2 });
    if (ovalRef.current) {
      tl.add(pageTransitions.fadeInScale(ovalRef.current, 0.3));
    }
    return () => {
      tl.kill();
    };
  }, []);

  // ✅ handler for button
  const handleStartJournaling = () => {
    navigate("/login");
  };

  return (
    <section
      className="h-screen w-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-wellness-cream via-wellness-warm-white to-wellness-peach/20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-wellness-mint/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-wellness-lavender/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-wellness-sky/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Intro */}
      <div className="mb-4 sm:mb-6 z-10 max-w-[90%] sm:max-w-2xl">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold text-ocean-text mb-2">
          Welcome to Your Safe Space
        </h1>
        <p className="text-sm sm:text-base md:text-xl text-ocean-text/70 leading-relaxed max-w-2xl mx-auto">
          Meet Eve, your AI companion for mental wellness journaling. 
          She's here to listen, understand, and support your journey with compassion and care.
        </p>
      </div>

      {/* Oval Mic with Enhanced Styling */}
      <div className="relative z-10 animate-scale-in" style={{animationDelay: '0.3s'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-primary/20 to-ocean-secondary/20 rounded-full blur-2xl scale-150 animate-pulse-soft"></div>
        <Eve size="large" />
      </div>

      {/* Text + Buttons */}
      <div className="mt-12 sm:mt-16 md:mt-20 text-center z-10 max-w-[90%] sm:max-w-xl animate-slide-up" style={{animationDelay: '0.6s'}}>
        <p className="text-sm sm:text-base md:text-lg text-ocean-text/80 mb-3 sm:mb-4 font-medium">
          Tap to talk with Eve
        </p>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-soft border border-white/40">
          <p className="text-xs sm:text-sm md:text-base text-ocean-text/80 italic leading-relaxed">
            "Hi there! I'm Eve, your personal wellness companion. 
            I'm here to help you process your thoughts and support your mental health journey with understanding and care."
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <button
            onClick={handleStartJournaling}
            className="group px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-ocean-primary to-ocean-secondary text-white shadow-medium hover:shadow-large transition-all duration-300 transform hover:scale-105 hover:from-ocean-secondary hover:to-ocean-primary text-sm sm:text-base font-semibold relative overflow-hidden"
          >
            <span className="relative z-10">Start Your Journey</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Enhanced Buddha Image with Better Blending */}
      <div className="absolute right-0 top-0 h-full w-1/2 sm:w-1/3 pointer-events-none z-0 bg-wellness-cream">
        <img
          src="/buddhaFace3.jpg"
          alt="Buddha Face Right"
          className="h-full w-full object-cover object-right opacity-30 translate-x-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wellness-cream via-wellness-warm-white/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-wellness-peach/10 to-transparent" />
      </div>



      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(108, 203, 119, 0.3) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
    </section>
  );
};

export default Hero;
