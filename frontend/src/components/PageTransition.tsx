import React, { type ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen ${className}`}>
      {children}
    </div>
  );
};

export default PageTransition;
