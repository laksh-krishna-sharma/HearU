import React, { useEffect, useRef } from 'react';
import { loadingAnimations, floatingAnimation } from '../utils/animations';

interface LoadingProps {
  message?: string;
  type?: 'spinner' | 'pulse' | 'dots' | 'wave';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  type = "spinner",
  size = "md",
  color = "primary"
}) => {
  const spinnerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-ocean-primary border-ocean-primary',
    secondary: 'text-ocean-secondary border-ocean-secondary',
    accent: 'text-ocean-accent border-ocean-accent'
  };

  useEffect(() => {
    if (type === 'spinner' && spinnerRef.current) {
      loadingAnimations.spinner(spinnerRef.current);
    }

    if (type === 'dots' && dotsRef.current) {
      const dots = dotsRef.current.children;
      Array.from(dots).forEach((dot, index) => {
        loadingAnimations.pulse(dot);
        // Stagger the animation
        (dot as HTMLElement).style.animationDelay = `${index * 0.2}s`;
      });
    }

    if (type === 'wave' && waveRef.current) {
      const bars = waveRef.current.children;
      Array.from(bars).forEach((bar, index) => {
        floatingAnimation(bar, {
          y: -20,
          duration: 1,
          delay: index * 0.1,
          ease: "sine.inOut"
        });
      });
    }

    // Animate message
    if (messageRef.current) {
      floatingAnimation(messageRef.current, {
        y: -5,
        duration: 2,
        ease: "sine.inOut"
      });
    }
  }, [type]);

  const renderSpinner = () => (
    <div 
      ref={spinnerRef}
      className={`${sizeClasses[size]} border-2 border-transparent border-t-current rounded-full ${colorClasses[color]}`}
    />
  );

  const renderPulse = () => (
    <div className={`${sizeClasses[size]} rounded-full bg-current ${colorClasses[color]} pulse-glow`} />
  );

  const renderDots = () => (
    <div ref={dotsRef} className="flex space-x-2">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i} 
          className={`w-3 h-3 rounded-full bg-current ${colorClasses[color]}`}
        />
      ))}
    </div>
  );

  const renderWave = () => (
    <div ref={waveRef} className="flex items-end space-x-1">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i}
          className={`w-2 bg-current ${colorClasses[color]}`}
          style={{ height: `${12 + Math.random() * 20}px` }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return renderSpinner();
      case 'pulse':
        return renderPulse();
      case 'dots':
        return renderDots();
      case 'wave':
        return renderWave();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="flex items-center justify-center">
        {renderLoader()}
      </div>
      {message && (
        <p 
          ref={messageRef}
          className={`text-sm font-medium ${colorClasses[color]} opacity-70`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

// Full screen loading overlay
export const LoadingOverlay: React.FC<LoadingProps> = (props) => {
  return (
    <div className="fixed inset-0 bg-ocean-background bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <Loading {...props} />
      </div>
    </div>
  );
};

// Loading skeleton for cards
export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
      <div className="space-y-2">
        <div className="bg-gray-200 rounded h-4 w-3/4"></div>
        <div className="bg-gray-200 rounded h-4 w-1/2"></div>
      </div>
    </div>
  );
};

export default Loading;
