import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Sparkles,
  Cpu
} from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Predict', path: '/predict' },
  { name: 'Dataset', path: '/students' },
  { name: 'Model Info', path: '/model' },
  { name: 'About', path: '/about' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6">
      <div className="max-w-[1400px] w-[calc(100%-16px)] sm:w-[calc(100%-32px)] my-3 mx-auto rounded-[24px] bg-slate-900/85 backdrop-blur-md border border-slate-800/80 shadow-2xl shadow-slate-950/60 px-5 py-2.5 flex items-center justify-between transition-all">
        
        {/* LEFT: Compact Brand Logo */}
        <NavLink to="/dashboard" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="leading-tight">
            <h1 className="text-xs font-black text-white tracking-tight flex items-center gap-1">
              Smart Backlog
            </h1>
            <span className="text-[10px] font-bold text-indigo-400 block -mt-0.5">Predictor</span>
          </div>
        </NavLink>

        {/* CENTER: Navigation Links (Sequence: Dashboard -> Predict -> Dataset -> Model Info -> About) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/dashboard' && location.pathname === '/');
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`
                  relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                  ${isActive 
                    ? 'text-white bg-indigo-600/90 shadow-md shadow-indigo-600/25' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
                `}
              >
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* RIGHT: Model Status Indicator & Predict Shortcut */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-400" />
              ML Model Ready
            </span>
          </div>
          <NavLink
            to="/predict"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Predict Risk</span>
          </NavLink>
        </div>

        {/* MOBILE: Hamburger Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE: Floating Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-[1400px] w-[calc(100%-16px)] mx-auto mt-2 p-4 rounded-[20px] bg-slate-900/95 backdrop-blur-lg border border-slate-800 shadow-2xl space-y-3 animate-fade-in">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  px-4 py-2.5 rounded-xl text-xs font-semibold transition-all
                  ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Decision Tree ML
            </span>
            <NavLink
              to="/predict"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
            >
              Predict Now
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
