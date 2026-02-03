
import React, { useState, useEffect } from 'react';
import { UserProfile, Recipe, Meal } from '../types';
import { generateProRecipes } from '../services/gemini';
import { ChefHat, Loader2, Sparkles, Clock, Flame, ShoppingCart, Check, ChefHatIcon } from 'lucide-react';

interface PremiumRecipesProps {
  profile: UserProfile;
  mealsToday: Meal[];
}

const PremiumRecipes: React.FC<PremiumRecipesProps> = ({ profile, mealsToday }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  const totalP = mealsToday.reduce((s, m) => s + m.protein, 0);
  const totalC = mealsToday.reduce((s, m) => s + m.carbs, 0);
  const totalF = mealsToday.reduce((s, m) => s + m.fats, 0);

  const remainingP = Math.max(0, profile.macroGoals.protein - totalP);
  const remainingC = Math.max(0, profile.macroGoals.carbs - totalC);
  const remainingF = Math.max(0, profile.macroGoals.fats - totalF);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const macroStr = `${remainingP}g Protein, ${remainingC}g Carbs, ${remainingF}g Fat`;
      const result = await generateProRecipes(profile, macroStr);
      setRecipes(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Premium+ Elite</span>
            <span className="text-slate-400 text-xs font-bold">Dynamic Recipe Engine</span>
          </div>
          <h2 className="text-3xl font-black mb-6">Targeted Meal Planning</h2>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <RemainingMacro label="Protein" val={remainingP} unit="g" color="text-blue-400" />
            <RemainingMacro label="Carbs" val={remainingC} unit="g" color="text-emerald-400" />
            <RemainingMacro label="Fats" val={remainingF} unit="g" color="text-amber-400" />
          </div>
          
          <button 
            onClick={fetchRecipes}
            disabled={loading}
            className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-50 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            Regenerate for Today's Macros
          </button>
        </div>
        <div className="absolute right-0 top-0 opacity-10 -rotate-12 translate-x-1/4">
          <ChefHatIcon size={300} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="bg-slate-100 rounded-3xl h-64 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{recipe.title}</h3>
                    <div className="flex gap-4 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={14}/> {recipe.time}</span>
                      <span className="flex items-center gap-1"><Flame size={14}/> {recipe.calories} kcal</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <ChefHat className="text-indigo-600" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Targeted Macros</h4>
                    <div className="flex gap-4">
                      <RecipeMacro val={recipe.macros.protein} label="P" />
                      <RecipeMacro val={recipe.macros.carbs} label="C" />
                      <RecipeMacro val={recipe.macros.fats} label="F" />
                    </div>
                  </div>

                  <div>
                     <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Ingredients</h4>
                     <ul className="grid grid-cols-2 gap-2">
                        {recipe.ingredients.map((ing, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                            <div className="w-1 h-1 bg-indigo-300 rounded-full" /> {ing}
                          </li>
                        ))}
                     </ul>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                <button 
                  onClick={() => setSaved(s => [...s, recipe.id])}
                  className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"
                >
                  {saved.includes(recipe.id) ? <Check /> : <ShoppingCart size={18} />}
                  {saved.includes(recipe.id) ? 'Added to Groceries' : 'Order Ingredients'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RemainingMacro = ({ label, val, unit, color }: any) => (
  <div>
    <div className="text-[10px] font-black uppercase opacity-60 tracking-tighter">{label} Left</div>
    <div className={`text-2xl font-black ${color}`}>{val}{unit}</div>
  </div>
);

const RecipeMacro = ({ val, label }: any) => (
  <div className="bg-slate-50 px-4 py-2 rounded-xl text-center min-w-[60px]">
    <div className="text-xs font-black text-slate-900">{val}g</div>
    <div className="text-[10px] font-bold text-slate-400">{label}</div>
  </div>
);

export default PremiumRecipes;
