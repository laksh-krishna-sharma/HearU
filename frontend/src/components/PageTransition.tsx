import React, { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { pageTransitions, createTimeline, cleanupScrollTriggers } from '../utils/animations';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    // Clean up any existing ScrollTriggers
    cleanupScrollTriggers();
    
    // Create page entrance animation
    const tl = createTimeline();
    
    if (containerRef.current) {
      // Set initial state
      containerRef.current.style.opacity = '0';
      containerRef.current.style.transform = 'translateY(30px)';
      
      // Animate in
      tl.to(containerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        clearProps: "transform"
      });
    }

    return () => {
      tl.kill();
    };
  }, [location.pathname]);

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen ${className}`}
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
};

// Alternative transition types
export const FadeTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    cleanupScrollTriggers();
    
    if (containerRef.current) {
      pageTransitions.fadeInScale(containerRef.current, 0);
    }
  }, [location.pathname]);

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen opacity-0 ${className}`}
    >
      {children}
    </div>
  );
};

export const SlideTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    cleanupScrollTriggers();
    
    if (containerRef.current) {
      pageTransitions.slideInLeft(containerRef.current, 0);
    }
  }, [location.pathname]);

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen opacity-0 ${className}`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
