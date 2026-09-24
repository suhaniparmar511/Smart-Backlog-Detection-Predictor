import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import Students from './pages/Students';
import Model from './pages/Model';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        
        {/* Modern Top Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          <Routes>
            {/* Opening website shows Dashboard first */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/students" element={<Students />} />
            <Route path="/model" element={<Model />} />
            <Route path="/about" element={<About />} />

            {/* Fallback to Dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        <footer className="py-6 px-8 border-t border-slate-900 text-center text-xs text-slate-500">
          <p>© Smart Backlog Detection Predictor • Powered by FastAPI & DecisionTree ML</p>
        </footer>
      </div>
    </Router>
  );
}
