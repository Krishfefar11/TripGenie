import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-primary animate-spin" />
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-b-secondary animate-pulse" />
      </div>
      <p className="mt-6 text-slate-500 font-medium tracking-wide animate-pulse-soft">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
