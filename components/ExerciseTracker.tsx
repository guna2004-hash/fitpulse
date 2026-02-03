
import React, { useState } from 'react';
import { Exercise, ExerciseCategory } from '../types';
import { EXERCISE_CATEGORIES } from '../constants';
import { 
  Plus, Activity, Trash2, Clock, Zap, 
  Smartphone, RefreshCw, Footprints, CheckCircle2, Loader2
} from 'lucide-react';

interface ExerciseTrackerProps {
  exercises: Exercise[];
  steps: number;
  onAddExercise: (ex: Exercise) => void;
  onRemoveExercise: (id: string) => void;
  onUpdateSteps: (steps: number) => void;
}

const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({ 
  exercises, steps, onAddExercise, onRemoveExercise, onUpdateSteps 
}) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [burned, setBurned] = useState('');
  const [category, setCategory] = useState<ExerciseCategory>('cardio');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<null | 'success'>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !duration || !burned) return;

    onAddExercise({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      name,
      duration: parseInt(duration),
      caloriesBurned: parseInt(burned),
      category
    });

    setName('');
    setDuration('');
    setBurned('');
  };

  const simulateSync = () => {
    setIsSyncing(true);
    setSyncStatus(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('success');
      // Simulate adding random steps if zero or increasing
      const newSteps = steps + Math.floor(Math.random() * 2000) + 1000;
      onUpdateSteps(newSteps);
      setTimeout(() => setSyncStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step Counter Widget */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Footprints className="text-emerald-500" /> Daily Steps
            </h3>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today</div>
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <input 
              type="number"
              value={steps}
              onChange={(e) => onUpdateSteps(parseInt(e.target.value) || 0)}
              className="text-4xl font-black text-slate-900 w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-100 rounded-xl"
            />
          </div>

          <button 
            onClick={simulateSync}
            disabled={isSyncing}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all ${
              syncStatus === 'success' 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isSyncing ? (
              <Loader2 className="animate-spin" size={20} />
            ) : syncStatus === 'success' ? (
              <CheckCircle2 size={20} />
            ) : (
              <RefreshCw size={20} />
            )}
            {isSyncing ? 'Syncing Devices...' : syncStatus === 'success' ? 'Synced with Wearable' : 'Sync Device'}
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-40">
            <Smartphone size={24} />
            <div className="text-[10px] font-black uppercase tracking-widest">Connect Apple Health / Google Fit</div>
          </div>
        </div>

        {/* Add Exercise Panel */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-800">
            <Activity className="text-rose-500" />
            Add New Activity
          </h3>
          
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Workout (e.g., Morning Run)"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Mins"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Kcal"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium"
                  value={burned}
                  onChange={(e) => setBurned(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {EXERCISE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    category === cat.id 
                      ? `${cat.color} text-white border-transparent shadow-lg shadow-slate-200` 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-rose-100"
            >
              <Plus size={20} />
              Log Activity
            </button>
          </form>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-lg">Activity Journal</h3>
          <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {exercises.length} Items Today
          </span>
        </div>
        <div className="divide-y divide-slate-50">
          {exercises.length === 0 ? (
            <div className="p-16 text-center">
               <Activity className="mx-auto text-slate-200 mb-4" size={48} />
               <p className="text-slate-400 font-bold">No workouts tracked today yet.</p>
               <p className="text-sm text-slate-300">Time to hit the gym!</p>
            </div>
          ) : (
            exercises.map((ex) => (
              <div key={ex.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${EXERCISE_CATEGORIES.find(c => c.id === ex.category)?.color || 'bg-rose-500'}`}>
                    <Activity size={24} />
                  </div>
                  <div>
                    <div className="font-black text-slate-900 capitalize text-lg">{ex.name}</div>
                    <div className="text-xs text-slate-500 font-bold flex gap-4 mt-1">
                      <span className="flex items-center gap-1 uppercase tracking-widest"><Clock size={12}/> {ex.duration} mins</span>
                      <span className="flex items-center gap-1 uppercase tracking-widest text-slate-400">
                        {ex.category || 'workout'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-2xl font-black text-rose-500 flex items-center gap-1">
                      <Zap size={20} fill="currentColor"/> {ex.caloriesBurned} <span className="text-xs text-rose-300 uppercase">kcal</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveExercise(ex.id)}
                    className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ).reverse()}
        </div>
      </div>
    </div>
  );
};

export default ExerciseTracker;
