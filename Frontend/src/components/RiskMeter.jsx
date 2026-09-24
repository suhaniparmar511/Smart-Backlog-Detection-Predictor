import React from 'react';

export default function RiskMeter({ riskPercentage = 0, isBacklog = false }) {
  const percentage = Math.min(Math.max(riskPercentage, 0), 100);

  let riskLevel = "Low Risk";
  let colorClass = "from-emerald-500 to-teal-400";
  let textClass = "text-emerald-400";
  let bgClass = "bg-emerald-500/10 border-emerald-500/30";

  if (percentage > 60) {
    riskLevel = "High Risk";
    colorClass = "from-rose-600 to-pink-500";
    textClass = "text-rose-400";
    bgClass = "bg-rose-500/10 border-rose-500/30";
  } else if (percentage > 30) {
    riskLevel = "Medium Risk";
    colorClass = "from-amber-500 to-yellow-400";
    textClass = "text-amber-400";
    bgClass = "bg-amber-500/10 border-amber-500/30";
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center w-full">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* SVG Circular Ring */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeDasharray={263.89}
            strokeDashoffset={263.89 - (263.89 * percentage) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            fill="transparent"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={percentage > 60 ? "stop-color-rose" : percentage > 30 ? "stop-color-amber" : "stop-color-emerald"} stopColor={percentage > 60 ? "#f43f5e" : percentage > 30 ? "#f59e0b" : "#10b981"} />
              <stop offset="100%" stopColor={percentage > 60 ? "#e11d48" : percentage > 30 ? "#d97706" : "#059669"} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl lg:text-4xl font-black text-white tracking-tight">
            {percentage.toFixed(2)}%
          </span>
          <span className="text-xs text-slate-400 font-medium mt-0.5">
            Risk Probability
          </span>
        </div>
      </div>

      {/* Risk Badge & Level */}
      <div className={`mt-4 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${bgClass} ${textClass}`}>
        {riskLevel} • {isBacklog ? 'Backlog Predicted' : 'No Backlog Predicted'}
      </div>

      {/* Risk Range Meter Bar */}
      <div className="w-full mt-6 space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
          <span>0% (Low)</span>
          <span>50% (Medium)</span>
          <span>100% (High)</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-1000`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
