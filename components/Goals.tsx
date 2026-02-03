
import React from 'react';
import { UserProfile } from '../types';
import { Target, User, Scale, Droplets, Zap, ShieldCheck } from 'lucide-react';

interface GoalsProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
}

const Goals: React.FC<GoalsProps> = ({ profile, onUpdateProfile }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdateProfile({
      ...profile,
      [name]: name === 'age' || name === 'weight' || name === 'height' || name === 'targetCalories' || name === 'stepGoal' || name === 'targetWeight' || name === 'startWeight' || name === 'waterGoal' || name === 'trainingDayOffset'
        ? parseFloat(value) || 0 
        : value,
    });
  };

  const handleMacroChange = (key: string, value: string) => {
    onUpdateProfile({
      ...profile,
      macroGoals: {
        ...profile.macroGoals,
        [key]: parseInt(value) || 0
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-black mb-8 flex items-center gap-2">
            <User className="text-indigo-500" />
            Body Metrics
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">Display Name</label>
              <input name="name" value={profile.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputBox label="Weight (kg)" name="weight" val={profile.weight} onChange={handleChange} type="number" step="0.1" />
              <InputBox label="Target (kg)" name="targetWeight" val={profile.targetWeight} onChange={handleChange} type="number" step="0.1" />
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black flex items-center gap-2">
              <ShieldCheck className="text-indigo-600" /> Elite Nutrition
            </h3>
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Premium+</span>
          </div>
          
          <div className="space-y-6">
             <div className="grid grid-cols-3 gap-3">
               <MacroInput label="Protein" val={profile.macroGoals.protein} onChange={v => handleMacroChange('protein', v)} />
               <MacroInput label="Carbs" val={profile.macroGoals.carbs} onChange={v => handleMacroChange('carbs', v)} />
               <MacroInput label="Fats" val={profile.macroGoals.fats} onChange={v => handleMacroChange('fats', v)} />
             </div>
             
             <div className="p-6 bg-slate-900 rounded-3xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-black flex items-center gap-2"><Zap className="text-amber-400" size={16}/> Performance Offset</h4>
                  <div className="text-[10px] font-bold opacity-60">ACTIVE</div>
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    name="trainingDayOffset"
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={profile.trainingDayOffset}
                    onChange={handleChange}
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="font-black text-xl min-w-[80px] text-right">+{profile.trainingDayOffset} <span className="text-[10px] opacity-40">kcal</span></span>
                </div>
                <p className="text-[10px] opacity-50 mt-3 font-medium">Extra calories allocated on days with tracked intense physical activity.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputBox = ({ label, name, val, onChange, ...props }: any) => (
  <div>
    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
    <input name={name} value={val} onChange={onChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-indigo-500" {...props} />
  </div>
);

const MacroInput = ({ label, val, onChange }: any) => (
  <div className="text-center">
    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">{label} (g)</label>
    <input 
      type="number" 
      value={val} 
      onChange={e => onChange(e.target.value)} 
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 font-black text-center text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
    />
  </div>
);

export default Goals;
