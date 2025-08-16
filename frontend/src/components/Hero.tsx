import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background with Wave Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-background via-blue-50 to-green-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-ocean-secondary to-ocean-primary rounded-full mix-blend-multiply filter blur-xl animate-wave"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-ocean-accent to-ocean-primary rounded-full mix-blend-multiply filter blur-xl animate-wave" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-ocean-secondary to-ocean-accent rounded-full mix-blend-multiply filter blur-xl animate-wave" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-ocean-text mb-6 leading-tight">
          You're Not Alone in This
          <span className="block text-ocean-primary mt-2">Journey</span>
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl text-ocean-text opacity-80 mb-8 max-w-3xl mx-auto leading-relaxed">
          HearU is here to support you through difficult times. Connect with caring professionals, 
          find resources, and discover that healing is possible. Your mental wellness matters.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/signup"
            className="px-8 py-4 md:px-10 md:py-5 text-lg md:text-xl font-semibold text-white bg-ocean-primary rounded-xl transition-all duration-300 hover:bg-ocean-accent hover:scale-105 focus:outline-none focus:ring-4 focus:ring-ocean-primary focus:ring-opacity-50 shadow-lg text-center inline-block"
          >
            Get Started Today
          </Link>
          
          <p className="text-sm md:text-base text-ocean-text opacity-70 mt-2 sm:mt-0">
            Free • Confidential • Available 24/7
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-ocean-text opacity-60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-ocean-primary rounded-full"></div>
            <span>Licensed Professionals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-ocean-secondary rounded-full"></div>
            <span>Crisis Support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-ocean-accent rounded-full"></div>
            <span>Youth Focused</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-ocean-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-ocean-primary rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;