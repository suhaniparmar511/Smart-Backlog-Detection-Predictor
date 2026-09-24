import React from 'react';

export default function LoadingSpinner({ message = 'Loading live data from FastAPI backend...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full min-h-[300px] text-center space-y-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-violet-500/20 border-b-violet-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <p className="text-xs font-semibold text-slate-400 animate-pulse tracking-wide">
        {message}
      </p>
    </div>
  );
}
