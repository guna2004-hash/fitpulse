
import React, { useState, useEffect } from 'react';
import { UserProfile, DietPlan as IDietPlan } from '../types';
import { generateDietPlan } from '../services/gemini';
import { Sparkles, Loader2, Apple, ChefHat, Salad, Cookie } from 'lucide-react';

interface DietPlanProps {
  profile: UserProfile;
}

const DietPlan: React.FC<DietPlanProps> = ({ profile }) => {
  const [plan, setPlan] = useState<IDietPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const result = await generateDietPlan(profile);
      setPlan(result);
    } catch (error) {
      console.error("Failed to generate plan", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!plan) fetchPlan();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
        <div className="text-center">
          <h3 className="text-xl font-bold">Creating your custom plan...</h3>
          <p className="text-slate-500">Gemini AI is analyzing your goals and metrics</p>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block">AI PERSONALIZED</span>
            <h2 className="text-3xl font-extrabold">{plan.title}</h2>
          </div>
          <button 
            onClick={fetchPlan}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"
            title="Refresh Plan"
          >
            <Sparkles size={24} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2 bg-white/5 p-3 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-2 flex-shrink-0" />
              <p className="text-sm text-indigo-50">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MealCard 
          icon={<Apple className="text-red-500" />} 
          label="Breakfast" 
          content={plan.sampleDay.breakfast} 
        />
        <MealCard 
          icon={<ChefHat className="text-amber-500" />} 
          label="Lunch" 
          content={plan.sampleDay.lunch} 
        />
        <MealCard 
          icon={<Salad className="text-emerald-500" />} 
          label="Dinner" 
          content={plan.sampleDay.dinner} 
        />
        <MealCard 
          icon={<Cookie className="text-orange-500" />} 
          label="Snacks" 
          content={plan.sampleDay.snacks} 
        />
      </div>
    </div>
  );
};

const MealCard = ({ icon, label, content }: { icon: React.ReactNode, label: string, content: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors shadow-sm">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <h4 className="font-bold text-slate-800">{label}</h4>
    </div>
    <p className="text-slate-600 leading-relaxed text-sm">{content}</p>
  </div>
);

export default DietPlan;
