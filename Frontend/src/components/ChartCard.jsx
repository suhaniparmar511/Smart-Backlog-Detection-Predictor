import React from 'react';

export default function ChartCard({ title, subtitle, children, action }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800/80 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full h-64 lg:h-72">
        {children}
      </div>
    </div>
  );
}
