import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Loader2 className="w-5 h-5 text-ink animate-spin" />
      <p className="caption">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
