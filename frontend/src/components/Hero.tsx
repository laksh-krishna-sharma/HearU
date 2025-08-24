import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import navigate
import { pageTransitions, createTimeline } from '../utils/animations';
import { TbActivityHeartbeat } from "react-icons/tb";

const Hero = () => {
  const ovalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // ✅ init navigate

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
      className="h-screen w-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#EBE8D5] via-[#F5F3EA] to-[#DFD3B6]  px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Intro */}
      <div className="mb-4 sm:mb-6 z-10 max-w-[90%] sm:max-w-2xl">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold text-ocean-text mb-2">
          Welcome to Your Safe Space
        </h1>
        <p className="text-xs sm:text-sm md:text-lg text-ocean-text/80">
          Meet Eve, your AI companion for mental wellness journaling. 
          She's here to listen, understand, and support your journey.
        </p>
      </div>

      {/* Oval Mic */}
      <div
        ref={ovalRef}
        className="w-[80%] sm:w-[60%] md:w-[50%] h-12 sm:h-14 md:h-16 lg:h-20 bg-[#EBE8D9] rounded-full flex items-center justify-center border border-ocean-primary/30 px-3 sm:px-6 backdrop-blur-sm shadow-2xl opacity-0 z-10"
      >
        <button
          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:scale-110 duration-200 flex-shrink-0"
          style={{ 
            background: 'none',
            border: 'none',
            padding: 0,
            outline: 'none'
          }}
        >
          <TbActivityHeartbeat className="h-16 w-16 "/>
        </button>
      </div>

      {/* Text + Buttons */}
      <div className="mt-4 sm:mt-6 text-center z-10 max-w-[90%] sm:max-w-xl">
        <p className="text-xs sm:text-sm md:text-base text-ocean-text/80 mb-2 sm:mb-4">
          Tap to talk with Eve
        </p>
        <p className="text-[10px] sm:text-xs md:text-sm text-ocean-text/70 mb-4 sm:mb-6">
          "Hi there! I'm Eve, your personal wellness companion. 
          I'm here to help you process your thoughts and support your mental health journey."
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          {/* ✅ added onClick */}
          <button
            onClick={handleStartJournaling}
            className="px-4 py-2 sm:px-6 sm:py-2 rounded-xl bg-ocean-primary text-white shadow-lg hover:bg-ocean-accent hover:text-amber-100 transition text-xs sm:text-sm"
          >
            Start Journaling
          </button>
          <button className="px-4 py-2 sm:px-6 sm:py-2 rounded-xl  text-white border border-ocean-primary/40 shadow hover:bg-ocean-primary/10 hover:text-amber-100 transition text-xs sm:text-sm">
            View Past Entries
          </button>
        </div>
      </div>

      {/* Buddha Image Right Side */}
      <div className="absolute right-0 top-0 h-full w-1/2 sm:w-1/3 pointer-events-none z-0">
        <img
          src="/buddhaFace3.jpg"
          alt="Buddha Face Right"
          className="h-full w-full object-cover object-left opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#EBE8D5] via-transparent to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
