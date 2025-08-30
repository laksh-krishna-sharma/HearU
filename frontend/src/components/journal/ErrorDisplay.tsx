import React from 'react';

interface ErrorDisplayProps {
  error: unknown;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      Error: {typeof error === 'string' ? error : 'An error occurred'}
    </div>
  );
};

export default ErrorDisplay;