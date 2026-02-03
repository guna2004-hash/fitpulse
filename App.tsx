
import React, { useState, useEffect } from 'react';
import { UserProfile, DailyData, Meal, Exercise, WeightLog, SubscriptionTier } from './types';
import { API } from './services/api';
import Dashboard from './components/Dashboard';
import MealTracker from './components/MealTracker';
import ExerciseTracker from './components/ExerciseTracker';
import DietPlan from './components/DietPlan';
import Goals from './components/Goals';
import Community from './components/Community';
import PremiumRecipes from './components/PremiumRecipes';
import Challenges from './components/Challenges';
import Upgrade from './components/Upgrade';
import Auth from './components/Auth';
import GoalSelection from './components/GoalSelection';
import { 
  LayoutDashboard, Utensils, Activity, Sparkles, 
  Target, Menu, X, Users, MessageCircle, ChefHat, Trophy, ShieldCheck, LogOut 
} from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsGoalSelection, setNeedsGoalSelection] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayData, setTodayData] = useState<DailyData | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'meals' | 'exercises' | 'diet' | 'community' | 'goals' | 'recipes' | 'challenges' | 'upgrade'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const user = localStorage.getItem('fitpulse_user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setProfile(parsedUser);
          setIsAuthenticated(true);
          
          // Force onboarding if goal isn't specific
          if (parsedUser.goal === 'maintain' || !parsedUser.goal) {
            setNeedsGoalSelection(true);
          }

          const log = await API.logs.getToday();
          setTodayData(log);
        }
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (profile && isAuthenticated && !needsGoalSelection) {
      API.user.update(profile);
    }
  }, [profile, isAuthenticated, needsGoalSelection]);

  useEffect(() => {
    if (todayData && isAuthenticated) {
      API.logs.save(todayData);
    }
  }, [todayData, isAuthenticated]);

  const handleUpdateToday = (updatedToday: DailyData) => setTodayData(updatedToday);

  const addMeal = (meal: Meal) => todayData && handleUpdateToday({ ...todayData, meals: [...todayData.meals, meal] });
  const removeMeal = (id: string) => todayData && handleUpdateToday({ ...todayData, meals: todayData.meals.filter(m => m.id !== id) });
  const addExercise = (ex: Exercise) => todayData && handleUpdateToday({ ...todayData, exercises: [...todayData.exercises, ex] });
  const removeExercise = (id: string) => todayData && handleUpdateToday({ ...todayData, exercises: todayData.exercises.filter(e => e.id !== id) });
  const updateSteps = (steps: number) => todayData && handleUpdateToday({ ...todayData, steps });
  const updateWater = (amount: number) => todayData && handleUpdateToday({ ...todayData, waterIntake: amount });
  const updateFasting = (start: number | undefined) => todayData && handleUpdateToday({ ...todayData, fastingStart: start });

  const logWeight = (weight: number) => {
    if (!profile) return;
    const today = new Date().toISOString().split('T')[0];
    const newEntry = { date: today, weight };
    let newHistory = [...weightHistory];
    const existingIndex = newHistory.findIndex(e => e.date === today);
    if (existingIndex !== -1) newHistory[existingIndex] = newEntry; else newHistory.push(newEntry);
    setWeightHistory(newHistory.sort((a, b) => a.date.localeCompare(b.date)));
    setProfile(prev => prev ? ({ ...prev, weight }) : null);
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    await API.user.upgrade(tier);
    setProfile(prev => prev ? ({
      ...prev,
      subscriptionTier: tier,
      isPremium: tier !== 'free'
    }) : null);
  };

  const handleAuthComplete = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsAuthenticated(true);
    // Force onboarding if the goal is the default 'maintain'
    if (newProfile.goal === 'maintain') {
      setNeedsGoalSelection(true);
    }
    const log = await API.logs.getToday();
    setTodayData(log);
  };

  const handleGoalSelection = (goal: 'lose_weight' | 'gain_muscle') => {
    if (!profile) return;
    
    let targetCalories = 2200;
    if (goal === 'lose_weight') targetCalories = 1800;
    if (goal === 'gain_muscle') targetCalories = 2800;

    const updatedProfile = { ...profile, goal, targetCalories };
    setProfile(updatedProfile);
    setNeedsGoalSelection(false);
    API.user.update(updatedProfile);
  };

  const handleLogout = () => {
    API.auth.logout();
    setIsAuthenticated(false);
    setProfile(null);
    setTodayData(null);
    setNeedsGoalSelection(false);
    setActiveTab('dashboard');
    setIsSidebarOpen(false);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Activity className="text-indigo-500 animate-pulse" size={64} />
      </div>
    );
  }

  if (!isAuthenticated || !profile || !todayData) {
    return <Auth onAuthComplete={handleAuthComplete} />;
  }

  if (needsGoalSelection) {
    return <GoalSelection onSelect={handleGoalSelection} />;
  }

  const isElite = profile.subscriptionTier === 'elite';
  const isPremium = profile.isPremium;

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'meals', label: 'Food Log', icon: <Utensils size={20} /> },
    { id: 'exercises', label: 'Fitness', icon: <Activity size={20} /> },
    { id: 'recipes', label: 'Elite Recipes', icon: <ChefHat size={20} />, locked: !isElite },
    { id: 'diet', label: 'AI Coach', icon: <Sparkles size={20} />, locked: !isPremium },
    { id: 'challenges', label: 'Challenges', icon: <Trophy size={20} /> },
    { id: 'community', label: 'Community', icon: <Users size={20} /> },
    { id: 'goals', label: 'Settings', icon: <Target size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
              <Activity size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-none">FitPulse</h1>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{profile.subscriptionTier.toUpperCase()} AI</span>
            </div>
          </div>
          
          <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.locked) {
                    setActiveTab('upgrade');
                  } else {
                    setActiveTab(tab.id as any);
                  }
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all relative group ${
                  activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                {tab.icon} {tab.label}
                {tab.locked && <Lock className="absolute right-4 opacity-40 group-hover:opacity-100 transition-opacity" size={14} />}
              </button>
            ))}
          </nav>

          <div className="mt-8 space-y-4">
            {profile.subscriptionTier !== 'elite' && (
              <button 
                onClick={() => setActiveTab('upgrade')}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-700 text-white p-5 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 group transition-all hover:scale-[1.02]"
              >
                <ShieldCheck size={20} className="group-hover:animate-bounce" />
                <span className="font-black text-xs uppercase tracking-widest">Upgrade to Elite</span>
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="w-full text-slate-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 p-3 transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          <div className="mt-auto pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md">{profile.name.charAt(0)}</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black text-slate-900 truncate">{profile.name}</p>
                <p className="text-[10px] font-bold text-indigo-500 uppercase">Tier: {profile.subscriptionTier}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 min-h-screen">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2"><Activity className="text-indigo-600" /><span className="font-black text-xl">FitPulse</span></div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600"><Menu /></button>
        </header>

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight capitalize">
              {activeTab === 'dashboard' ? `Hello, ${profile.name.split(' ')[0]}` : activeTab.replace('goals', 'Settings').replace('recipes', 'Elite Recipes')}
            </h2>
            <p className="text-slate-400 font-medium">
               {activeTab === 'dashboard' && "Elite performance tracking enabled."}
               {activeTab === 'upgrade' && "Empower your journey with high-tier tools."}
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === 'dashboard' && <Dashboard profile={profile} today={todayData} weightHistory={weightHistory} onLogWeight={logWeight} onUpdateWater={updateWater} onUpdateFasting={updateFasting} />}
            {activeTab === 'meals' && <MealTracker meals={todayData.meals} onAddMeal={addMeal} onRemoveMeal={removeMeal} isPremium={isPremium} />}
            {activeTab === 'exercises' && <ExerciseTracker exercises={todayData.exercises} steps={todayData.steps} onAddExercise={addExercise} onRemoveExercise={removeExercise} onUpdateSteps={updateSteps} />}
            {activeTab === 'recipes' && <PremiumRecipes profile={profile} mealsToday={todayData.meals} />}
            {activeTab === 'challenges' && <Challenges profile={profile} onUpdateProfile={setProfile} />}
            {activeTab === 'diet' && <DietPlan profile={profile} />}
            {activeTab === 'community' && <Community />}
            {activeTab === 'goals' && <Goals profile={profile} onUpdateProfile={setProfile} />}
            {activeTab === 'upgrade' && <Upgrade profile={profile} onUpgrade={handleUpgrade} />}
          </div>
        </div>
      </main>
    </div>
  );
};

const Lock = ({ size, className, opacity }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={{ opacity }}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default App;
