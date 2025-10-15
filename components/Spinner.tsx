
import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-slate-800 bg-opacity-50 flex items-center justify-center z-10">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
