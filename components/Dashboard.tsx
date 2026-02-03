
import React, { useState, useEffect } from 'react';
import { UserProfile, DailyData, WeightLog } from '../types';
import { 
  Flame, Activity, Target, Footprints, Zap, Scale, Plus, 
  TrendingDown, TrendingUp, Droplets, Share2, Bell, CheckCircle, 
  Timer, History, ChevronRight, Sparkles
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  today: DailyData;
  weightHistory: WeightLog[];
  onLogWeight: (weight: number) => void;
  onUpdateWater: (amount: number) => void;
  onUpdateFasting: (start: number | undefined) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, today, weightHistory, onLogWeight, onUpdateWater, onUpdateFasting }) => {
  const [showShareToast, setShowShareToast] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [fastingProgress, setFastingProgress] = useState(0);

  const totalCals = today.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalBurned = today.exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
  const netCals = totalCals - totalBurned;
  
  const calProgressPercent = Math.min((totalCals / profile.targetCalories) * 100, 100);
  const stepProgressPercent = Math.min((today.steps / profile.stepGoal) * 100, 100);
  const waterProgressPercent = Math.min((today.waterIntake / profile.waterGoal) * 100, 100);

  useEffect(() => {
    if (!today.fastingStart) {
      setElapsedTime('00:00:00');
      setFastingProgress(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - (today.fastingStart || 0);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      
      setElapsedTime(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      setFastingProgress(Math.min((hours / profile.fastingGoal) * 100, 100));
    }, 1000);

    return () => clearInterval(interval);
  }, [today.fastingStart, profile.fastingGoal]);

  const handleShare = () => {
    const summary = `FitPulse AI Daily Summary:\n🔥 ${totalCals} kcal consumed\n⚡ ${totalBurned} kcal burned\n👣 ${today.steps} steps\n💧 ${today.waterIntake}ml hydrated\nWeight: ${profile.weight}kg`;
    navigator.clipboard.writeText(summary);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  return (
    <div className="space-y-6 relative animate-in fade-in duration-500">
      {showShareToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="text-emerald-400" size={20} />
          <span className="font-bold text-sm">Summary copied to clipboard!</span>
        </div>
      )}

      {/* Main Metabolic Status */}
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
          <Activity size={240} />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-center lg:justify-start gap-2">
              <Sparkles size={14} className="text-indigo-500" /> Metabolic Balance
            </h3>
            <div className="text-6xl font-black text-slate-900 mb-2 tabular-nums">
              {netCals.toLocaleString()}
              <span className="text-xl font-bold text-slate-300 ml-2 uppercase">Net Kcal</span>
            </div>
            <p className="text-slate-500 font-medium">
              You've burned <span className="text-rose-500 font-black">{totalBurned} kcal</span> through physical activity today.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
             <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" fill="transparent" stroke="#4f46e5" strokeWidth="8" 
                    strokeDasharray="282.7" 
                    strokeDashoffset={282.7 - (282.7 * calProgressPercent) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="text-3xl font-black text-slate-900">{Math.round(calProgressPercent)}%</div>
                   <div className="text-[10px] font-black text-slate-400 uppercase">of Limit</div>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <MiniStat label="Protein" current={today.meals.reduce((s, m) => s + m.protein, 0)} target={profile.macroGoals.protein} color="bg-blue-500" />
             <MiniStat label="Carbohydrates" current={today.meals.reduce((s, m) => s + m.carbs, 0)} target={profile.macroGoals.carbs} color="bg-emerald-500" />
             <MiniStat label="Fats" current={today.meals.reduce((s, m) => s + m.fats, 0)} target={profile.macroGoals.fats} color="bg-amber-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fasting Widget */}
        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Timer size={24} className={today.fastingStart ? "animate-pulse text-indigo-400" : ""} /> Fasting
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{profile.fastingGoal}h Goal</span>
            </div>
            <div className="text-center mb-6">
              <div className="text-5xl font-black mb-1 tabular-nums tracking-tight">{elapsedTime}</div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-60">
                {today.fastingStart ? "Current Window" : "Start Protocol"}
              </div>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-6">
              <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${fastingProgress}%` }} />
            </div>
            <button 
              onClick={() => onUpdateFasting(today.fastingStart ? undefined : Date.now())}
              className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                today.fastingStart ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {today.fastingStart ? "End Fast" : "Start Fast Now"}
            </button>
          </div>
        </div>

        {/* Hydration Widget */}
        <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/20 transition-transform duration-1000" style={{ transform: `translateY(${100 - waterProgressPercent}%)` }} />
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Droplets size={24} className="animate-bounce" /> Hydration
            </h3>
            <div className="text-center mb-8">
              <div className="text-5xl font-black mb-1">{today.waterIntake}<span className="text-lg opacity-60 ml-1">ml</span></div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-60">Goal: {profile.waterGoal}ml</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => onUpdateWater(today.waterIntake + 250)} className="bg-white/20 hover:bg-white/30 py-3 rounded-2xl font-bold text-sm transition-all">+250ml</button>
              <button onClick={() => onUpdateWater(today.waterIntake + 500)} className="bg-white/20 hover:bg-white/30 py-3 rounded-2xl font-bold text-sm transition-all">+500ml</button>
            </div>
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col justify-between">
           <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black flex items-center gap-2 text-slate-800">
                  <Footprints size={24} className="text-emerald-500" /> Movement
                </h3>
              </div>
              <div className="text-5xl font-black text-slate-900 mb-2 tabular-nums">{today.steps.toLocaleString()}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Daily Goal: {profile.stepGoal.toLocaleString()}</div>
           </div>
           <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${stepProgressPercent}%` }} />
           </div>
        </div>
      </div>
    </div>
  );
};

const MiniStat = ({ label, current, target, color }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-900">{current}g / {target}g</span>
    </div>
    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
      <div className={`${color} h-full transition-all duration-1000`} style={{ width: `${Math.min((current/target)*100, 100)}%` }} />
    </div>
  </div>
);

export default Dashboard;
