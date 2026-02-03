
import React, { useState } from 'react';
import { TrendingDown, TrendingUp, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface GoalSelectionProps {
  onSelect: (goal: 'lose_weight' | 'gain_muscle') => void;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<'lose_weight' | 'gain_muscle' | null>(null);

  const handleConfirm = () => {
    if (selected) onSelect(selected);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles size={14} /> AI Personalization
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">What's your goal?</h2>
          <p className="text-slate-500 font-medium text-lg">Choose one path to continue. We'll optimize your daily targets based on this choice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Weight Loss Card */}
          <button
            onClick={() => setSelected('lose_weight')}
            className={`relative p-10 rounded-[48px] text-left transition-all duration-500 border-2 group ${
              selected === 'lose_weight'
                ? 'bg-white border-indigo-600 shadow-2xl shadow-indigo-100 ring-8 ring-indigo-50 translate-y-[-8px]'
                : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm hover:translate-y-[-4px]'
            }`}
          >
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 ${
              selected === 'lose_weight' ? 'bg-indigo-600 text-white scale-110 rotate-3' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-400'
            }`}>
              <TrendingDown size={40} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">Weight Loss</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed text-lg">
              Focused on burning fat while maintaining lean muscle. Optimized for a healthy caloric deficit.
            </p>
            <div className="space-y-4">
              <FeatureItem active={selected === 'lose_weight'} text="Strategic Deficit Planning" />
              <FeatureItem active={selected === 'lose_weight'} text="Satiety-Focused Nutrition" />
              <FeatureItem active={selected === 'lose_weight'} text="Fat Metabolism Tracking" />
            </div>
            {selected === 'lose_weight' && (
              <div className="absolute top-10 right-10 text-indigo-600 animate-in zoom-in duration-300">
                <CheckCircle2 size={40} strokeWidth={3} />
              </div>
            )}
          </button>

          {/* Weight Gain Card */}
          <button
            onClick={() => setSelected('gain_muscle')}
            className={`relative p-10 rounded-[48px] text-left transition-all duration-500 border-2 group ${
              selected === 'gain_muscle'
                ? 'bg-white border-indigo-600 shadow-2xl shadow-indigo-100 ring-8 ring-indigo-50 translate-y-[-8px]'
                : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm hover:translate-y-[-4px]'
            }`}
          >
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 ${
              selected === 'gain_muscle' ? 'bg-indigo-600 text-white scale-110 -rotate-3' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-400'
            }`}>
              <TrendingUp size={40} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">Weight Gain</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed text-lg">
              Maximize muscle growth and strength. Optimized for a clean surplus and protein synthesis.
            </p>
            <div className="space-y-4">
              <FeatureItem active={selected === 'gain_muscle'} text="Muscle Growth Surplus" />
              <FeatureItem active={selected === 'gain_muscle'} text="High-Protein Optimization" />
              <FeatureItem active={selected === 'gain_muscle'} text="Strength Performance Insights" />
            </div>
            {selected === 'gain_muscle' && (
              <div className="absolute top-10 right-10 text-indigo-600 animate-in zoom-in duration-300">
                <CheckCircle2 size={40} strokeWidth={3} />
              </div>
            )}
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={`group px-14 py-6 rounded-[32px] font-black text-xl flex items-center gap-4 transition-all duration-300 ${
              selected 
                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
            }`}
          >
            Start My Journey
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ active, text }: { active: boolean; text: string }) => (
  <div className={`flex items-center gap-3 text-sm font-bold transition-all duration-300 ${active ? 'text-indigo-600 translate-x-1' : 'text-slate-400'}`}>
    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${active ? 'bg-indigo-600 scale-125' : 'bg-slate-200'}`} />
    {text}
  </div>
);

export default GoalSelection;
