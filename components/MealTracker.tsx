
import React, { useState, useEffect, useRef } from 'react';
import { Meal, MealCategory, CustomFood } from '../types';
import { analyzeMeal, searchFoodDatabase, analyzeMealImage } from '../services/gemini';
import { MEAL_CATEGORIES } from '../constants';
import { getCustomFoods, saveCustomFoods } from '../services/storage';
import { 
  Plus, Search, Loader2, Trash2, Star, Database, Sparkles, Camera, Zap, X
} from 'lucide-react';

interface MealTrackerProps {
  meals: Meal[];
  onAddMeal: (meal: Meal) => void;
  onRemoveMeal: (id: string) => void;
  isPremium: boolean;
}

const MealTracker: React.FC<MealTrackerProps> = ({ meals, onAddMeal, onRemoveMeal, isPremium }) => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MealCategory>('breakfast');
  const [mode, setMode] = useState<'ai' | 'search' | 'custom' | 'scan' | 'quick'>('ai');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [customFoods, setCustomFoods] = useState<CustomFood[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Quick Add State
  const [quickAdd, setQuickAdd] = useState({ name: '', calories: '', p: '', c: '', f: '' });

  useEffect(() => {
    setCustomFoods(getCustomFoods());
  }, []);

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsAnalyzing(true);
    try {
      if (mode === 'search') {
        const results = await searchFoodDatabase(description);
        setSearchResults(results);
      } else {
        const result = await analyzeMeal(description);
        addLoggedMeal(result);
        setDescription('');
      }
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addLoggedMeal({
      name: quickAdd.name || 'Quick Add',
      calories: parseInt(quickAdd.calories) || 0,
      protein: parseInt(quickAdd.p) || 0,
      carbs: parseInt(quickAdd.c) || 0,
      fats: parseInt(quickAdd.f) || 0,
    });
    setQuickAdd({ name: '', calories: '', p: '', c: '', f: '' });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
  };

  const captureAndScan = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvasRef.current.toDataURL('image/jpeg');
    const base64 = dataUrl.split(',')[1];

    setIsAnalyzing(true);
    try {
      const result = await analyzeMealImage(base64);
      addLoggedMeal(result);
      setMode('ai');
      stopCamera();
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addLoggedMeal = (data: any) => {
    const newMeal: Meal = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      name: data.name,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fats: data.fats,
      category: activeCategory,
    };
    onAddMeal(newMeal);
    setSearchResults([]);
  };

  const toggleMode = (newMode: typeof mode) => {
    if (newMode === 'scan') startCamera();
    else stopCamera();
    setMode(newMode);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
          <ModeButton active={mode === 'ai'} icon={<Sparkles size={16}/>} label="AI" onClick={() => toggleMode('ai')} />
          {isPremium && <ModeButton active={mode === 'scan'} icon={<Camera size={16}/>} label="Scan" onClick={() => toggleMode('scan')} />}
          <ModeButton active={mode === 'search'} icon={<Database size={16}/>} label="Search" onClick={() => toggleMode('search')} />
          <ModeButton active={mode === 'quick'} icon={<Zap size={16}/>} label="Quick" onClick={() => toggleMode('quick')} />
          <ModeButton active={mode === 'custom'} icon={<Star size={16}/>} label="Favs" onClick={() => toggleMode('custom')} />
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {MEAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as MealCategory)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeCategory === cat.id 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>

          {mode === 'scan' && (
            <div className="space-y-4 animate-in fade-in zoom-in-95">
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-200">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                    <Loader2 className="animate-spin mb-2" size={32} />
                    <span className="font-bold text-sm">Analyzing Meal...</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={captureAndScan} 
                  disabled={isAnalyzing}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Take Photo & Analyze
                </button>
                <button onClick={() => toggleMode('ai')} className="px-6 bg-slate-100 rounded-2xl text-slate-500 hover:bg-slate-200"><X /></button>
              </div>
            </div>
          )}

          {mode === 'quick' && (
            <form onSubmit={handleQuickAdd} className="space-y-4 animate-in slide-in-from-top-4">
              <input 
                placeholder="Meal Name (e.g. Protein Shake)" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold"
                value={quickAdd.name}
                onChange={e => setQuickAdd({...quickAdd, name: e.target.value})}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <QuickInput label="Cals" val={quickAdd.calories} onChange={v => setQuickAdd({...quickAdd, calories: v})} />
                <QuickInput label="Prot" val={quickAdd.p} onChange={v => setQuickAdd({...quickAdd, p: v})} />
                <QuickInput label="Carb" val={quickAdd.c} onChange={v => setQuickAdd({...quickAdd, c: v})} />
                <QuickInput label="Fat" val={quickAdd.f} onChange={v => setQuickAdd({...quickAdd, f: v})} />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">Add Macros Instantly</button>
            </form>
          )}

          {(mode === 'ai' || mode === 'search') && (
            <form onSubmit={handleAISearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={mode === 'ai' ? "e.g. 2 eggs and a bagel" : "Search 20M+ foods..."}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-12 font-bold"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isAnalyzing}
                />
                {mode === 'ai' ? <Sparkles className="absolute right-4 top-4 text-indigo-300" size={20} /> : <Search className="absolute right-4 top-4 text-slate-300" size={20} />}
              </div>
              <button
                type="submit"
                disabled={isAnalyzing || !description.trim()}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-8 font-bold transition-all disabled:opacity-50 min-w-[100px]"
              >
                {isAnalyzing ? <Loader2 className="animate-spin mx-auto" /> : (mode === 'ai' ? 'Log' : 'Find')}
              </button>
            </form>
          )}
          
          {/* Favorites View */}
          {mode === 'custom' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             {customFoods.length === 0 ? (
               <div className="col-span-full py-8 text-center text-slate-400 text-sm italic">Save foods here for one-tap logging.</div>
             ) : (
               customFoods.map(food => (
                 <div key={food.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                   <div className="cursor-pointer flex-1" onClick={() => addLoggedMeal(food)}>
                     <div className="font-bold text-slate-800">{food.name}</div>
                     <div className="text-xs text-indigo-600 font-semibold">{food.calories} kcal • P: {food.protein}g</div>
                   </div>
                   <button onClick={() => {
                     const updated = customFoods.filter(f => f.id !== food.id);
                     setCustomFoods(updated);
                     saveCustomFoods(updated);
                   }} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                     <Trash2 size={16} />
                   </button>
                 </div>
               ))
             )}
           </div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-6 space-y-2 border-t border-slate-100 pt-6">
              {searchResults.map((result, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-indigo-50/30 rounded-2xl hover:bg-indigo-50 transition-colors">
                  <div>
                    <div className="font-bold text-slate-900">{result.name}</div>
                    <div className="text-xs text-slate-500 font-bold flex gap-4 mt-1">
                      <span>P: {result.protein}g</span> <span>C: {result.carbs}g</span> <span>F: {result.fats}g</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-indigo-600 mr-4">{result.calories} kcal</span>
                    <button onClick={() => addLoggedMeal(result)} className="bg-white p-2 rounded-xl border border-slate-200 hover:border-indigo-500 transition-all">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Diary View */}
      <div className="space-y-4">
        {MEAL_CATEGORIES.map(category => {
          const categoryMeals = meals.filter(m => m.category === category.id);
          const categoryTotal = categoryMeals.reduce((sum, m) => sum + m.calories, 0);
          return (
            <div key={category.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{category.icon}</span>
                  <h3 className="font-bold text-slate-800">{category.label}</h3>
                </div>
                <div className="text-sm font-black bg-slate-100 px-3 py-1 rounded-full text-slate-600">{categoryTotal} kcal</div>
              </div>
              <div className="divide-y divide-slate-50">
                {categoryMeals.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">Empty</div>
                ) : (
                  categoryMeals.map(meal => (
                    <div key={meal.id} className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">{meal.name}</div>
                        <div className="flex gap-2 mt-2">
                          <MacroPill label="P" val={meal.protein} color="bg-blue-500" />
                          <MacroPill label="C" val={meal.carbs} color="bg-emerald-500" />
                          <MacroPill label="F" val={meal.fats} color="bg-amber-500" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right font-black text-slate-900">{meal.calories} kcal</div>
                        <button onClick={() => onRemoveMeal(meal.id)} className="p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ModeButton = ({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`flex-1 py-4 text-xs font-black flex items-center justify-center gap-2 transition-all min-w-[80px] ${active ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon} {label}
  </button>
);

const QuickInput = ({ label, val, onChange }: any) => (
  <div className="space-y-1">
    <div className="text-[10px] font-black text-slate-400 uppercase ml-1">{label}</div>
    <input 
      type="number" 
      value={val} 
      onChange={e => onChange(e.target.value)} 
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const MacroPill = ({ label, val, color }: any) => (
  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100">
    <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
    <span className="text-[10px] font-bold text-slate-500">{label}: {val}g</span>
  </div>
);

export default MealTracker;
