import React, { useState } from 'react';
import { Sparkles, AlertCircle, RefreshCcw } from 'lucide-react';
import { predictBacklog } from '../services/api';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';

export default function Predict() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePrediction = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await predictBacklog(formData);
      setResult(response);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(
        err.response?.data?.detail || 
        "Failed to communicate with FastAPI prediction service. Please verify backend is online."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8 py-4 animate-fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Machine Learning Inference</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Predict Backlog Risk
        </h1>
        <p className="text-xs lg:text-sm text-slate-400 max-w-lg mx-auto">
          Enter weekly study hours, attendance percentage, and participation score to calculate student backlog risk probability using DecisionTree ML.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-white font-bold text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className={result ? "lg:col-span-6" : "lg:col-span-8 lg:col-start-3"}>
          <PredictionForm onSubmit={handlePrediction} isLoading={isLoading} />
        </div>

        {/* Result Column */}
        {result && (
          <div className="lg:col-span-6 space-y-4">
            <PredictionResult result={result} />
            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Predict Another Student</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
