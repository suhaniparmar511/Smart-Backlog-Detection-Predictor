import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, LayoutDashboard, Layers, Cpu, ShieldAlert, ArrowRight, CheckCircle2, GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 py-6 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden p-8 lg:p-14 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Machine Learning Academic Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Smart Backlog <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
                Detection Predictor
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Predict student backlog risk using attendance, self-study habits and class participation powered by Decision Tree Classification.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/predict"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Predict Backlog Risk</span>
              </Link>

              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-all hover:scale-105 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span>View Dashboard</span>
              </Link>
            </div>
          </div>

          {/* CSS Decorative Graphic / AI Visual Node */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-slate-950/80 border border-indigo-500/20 p-6 flex flex-col justify-between shadow-2xl glow-indigo">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-mono text-indigo-400">DecisionTree (depth=5)</span>
              </div>

              {/* Node Diagram */}
              <div className="my-auto space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Weekly Study Hours</span>
                  <span className="font-bold text-indigo-400">Feature X1</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Attendance Percentage</span>
                  <span className="font-bold text-violet-400">Feature X2</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Class Participation</span>
                  <span className="font-bold text-purple-400">Feature X3</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-between text-xs">
                <span className="text-indigo-200 font-semibold">Backlog Risk Output</span>
                <span className="text-emerald-400 font-extrabold">Probability %</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Data-Driven</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Uses real student performance dataset (1,000,000 students) directly trained via Pandas and FastAPI backend.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800 hover:border-violet-500/40 transition-all hover:-translate-y-1 space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Machine Learning</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Decision Tree classification model tuned with balanced class weights to optimize recall for backlog detection.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Early Detection</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Identifies students at risk of academic backlog early, enabling timely intervention and study habit counseling.
          </p>
        </div>
      </section>

      {/* Process Workflow Flowchart */}
      <section className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-6 text-center">
        <h2 className="text-xl font-bold text-white tracking-tight">Project End-to-End Workflow</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">1</span>
            <span className="text-xs font-bold text-white">CSV Dataset</span>
            <span className="text-[11px] text-slate-500">student_performance.csv</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">2</span>
            <span className="text-xs font-bold text-white">Data Processing</span>
            <span className="text-[11px] text-slate-500">Pandas & Backlog Target</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">3</span>
            <span className="text-xs font-bold text-white">Machine Learning</span>
            <span className="text-[11px] text-slate-500">DecisionTreeClassifier</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">4</span>
            <span className="text-xs font-bold text-white">Backlog Prediction</span>
            <span className="text-[11px] text-slate-500">FastAPI + JSON Storage</span>
          </div>
        </div>
      </section>
    </div>
  );
}
