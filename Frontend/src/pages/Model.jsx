import React, { useState, useEffect } from 'react';
import { BrainCircuit, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck, Target, Award, Cpu } from 'lucide-react';
import { getModelEvaluation, trainModel } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Model() {
  const [evalData, setEvalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetraining, setIsRetraining] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchEvaluation();
  }, []);

  const fetchEvaluation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getModelEvaluation();
      setEvalData(data);
    } catch (err) {
      console.error("Evaluation fetch error:", err);
      setError("Failed to fetch model evaluation metrics from FastAPI backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrain = async () => {
    setIsRetraining(true);
    setMessage(null);
    try {
      const res = await trainModel();
      setMessage(`Model Retrained Successfully! Samples: Train=${res.training_samples}, Test=${res.testing_samples}. Acc: ${res.testing_accuracy}%`);
      await fetchEvaluation();
    } catch (err) {
      setError(`Retraining error: ${err.message}`);
    } finally {
      setIsRetraining(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Evaluating DecisionTree model on test dataset split..." />;
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-4 max-w-xl mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Model Evaluation Error</h3>
        <p className="text-xs text-rose-300">{error}</p>
        <button
          onClick={fetchEvaluation}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  // [[TN, FP], [FN, TP]]
  const cm = evalData.confusion_matrix || [[0, 0], [0, 0]];
  const tn = cm[0][0];
  const fp = cm[0][1];
  const fn = cm[1][0];
  const tp = cm[1][1];

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Machine Learning Intelligence</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 flex items-center gap-2.5">
            <BrainCircuit className="w-7 h-7 text-indigo-400" />
            Decision Tree Model Evaluation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Trained with: <span className="text-slate-200 font-semibold">DecisionTreeClassifier(max_depth=5, class_weight="balanced")</span>
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={isRetraining}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 self-start sm:self-auto transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
          <span>{isRetraining ? 'Retraining ML Model...' : 'Retrain Model Now'}</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Training Accuracy"
          value={`${evalData.training_accuracy}%`}
          subtitle="80% train split (800k samples)"
          icon={Award}
          color="indigo"
        />
        <StatCard
          title="Testing Accuracy"
          value={`${evalData.testing_accuracy}%`}
          subtitle="20% test split (200k samples)"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Recall (Backlog)"
          value={`${(evalData.recall * 100).toFixed(2)}%`}
          subtitle="True positive backlog rate"
          icon={Target}
          color="rose"
        />
        <StatCard
          title="Precision (Backlog)"
          value={`${(evalData.precision * 100).toFixed(2)}%`}
          subtitle="Positive predictive value"
          icon={Cpu}
          color="amber"
        />
        <StatCard
          title="F1 Score (Backlog)"
          value={evalData.f1_score}
          subtitle="Harmonic mean of P & R"
          icon={Award}
          color="violet"
        />
      </div>

      {/* Confusion Matrix & Academic Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix Table Box */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight">
            Confusion Matrix (Test Set: 200,000 Students)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border border-transparent"></th>
                  <th colSpan="2" className="p-2.5 bg-slate-950 text-indigo-300 font-bold uppercase text-[10px] border border-slate-800 rounded-t-xl">
                    Predicted Class
                  </th>
                </tr>
                <tr className="bg-slate-950/80 text-slate-400 font-semibold">
                  <th className="p-2.5 text-left font-bold uppercase text-[10px] text-indigo-300 border border-slate-800">
                    Actual Class
                  </th>
                  <th className="p-2.5 border border-slate-800">No Backlog (0)</th>
                  <th className="p-2.5 border border-slate-800">Backlog (1)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <th className="p-3 bg-slate-950/80 text-left font-semibold text-slate-300 border border-slate-800">
                    No Backlog (0)
                  </th>
                  <td className="p-4 bg-emerald-500/10 border border-slate-800 text-emerald-300 font-bold font-mono">
                    <span className="block text-sm">{tn.toLocaleString()}</span>
                    <span className="text-[10px] opacity-75 font-normal">True Negatives (TN)</span>
                  </td>
                  <td className="p-4 bg-amber-500/10 border border-slate-800 text-amber-300 font-bold font-mono">
                    <span className="block text-sm">{fp.toLocaleString()}</span>
                    <span className="text-[10px] opacity-75 font-normal">False Positives (FP)</span>
                  </td>
                </tr>
                <tr>
                  <th className="p-3 bg-slate-950/80 text-left font-semibold text-slate-300 border border-slate-800">
                    Backlog (1)
                  </th>
                  <td className="p-4 bg-rose-500/10 border border-slate-800 text-rose-300 font-bold font-mono">
                    <span className="block text-sm">{fn.toLocaleString()}</span>
                    <span className="text-[10px] opacity-75 font-normal">False Negatives (FN)</span>
                  </td>
                  <td className="p-4 bg-indigo-500/10 border border-slate-800 text-indigo-300 font-bold font-mono">
                    <span className="block text-sm">{tp.toLocaleString()}</span>
                    <span className="text-[10px] opacity-75 font-normal">True Positives (TP)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Academic Viva Explanation */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            Key ML Insights & Class Imbalance Note
          </h3>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <h4 className="font-bold text-indigo-300 text-xs">Why Recall is the Critical Metric:</h4>
              <p>
                In backlog prediction, missing a student who is actually at risk (False Negative) has far higher academic cost than flagging a safe student for review (False Positive).
              </p>
              <p className="font-semibold text-emerald-400 pt-1">
                Current Recall: {(evalData.recall * 100).toFixed(2)}% ({tp} out of {tp + fn} actual backlog cases detected!)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <h4 className="font-bold text-violet-300 text-xs">Handling Extreme Class Imbalance:</h4>
              <p>
                Grade F accounts for only 0.62% of all student records in the 1,000,000 CSV dataset. By using <code className="text-indigo-400">class_weight="balanced"</code> in Scikit-Learn, the Decision Tree penalizes backlog misclassifications, ensuring high recall.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
