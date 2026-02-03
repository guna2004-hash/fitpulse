
import { UserProfile, Challenge } from './types';

export const INITIAL_PROFILE: UserProfile = {
  name: 'Fit Enthusiast',
  email: 'user@fitpulse.ai',
  age: 28,
  weight: 75,
  startWeight: 75,
  targetWeight: 70,
  height: 180,
  gender: 'male',
  activityLevel: 'moderately_active',
  goal: 'lose_weight',
  targetCalories: 2200,
  stepGoal: 10000,
  waterGoal: 2500,
  isPremium: false,
  subscriptionTier: 'free',
  useNetCarbs: false,
  macroGoals: { protein: 150, carbs: 200, fats: 70 },
  trainingDayOffset: 300,
  fastingGoal: 16,
  activeChallenges: [],
};

export const STORAGE_KEYS = {
  PROFILE: 'fitpulse_profile',
  DAILY_LOGS: 'fitpulse_logs',
  CUSTOM_FOODS: 'fitpulse_custom_foods',
  WEIGHT_HISTORY: 'fitpulse_weight_history',
};

export const MEAL_CATEGORIES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { id: 'lunch', label: 'Lunch', icon: '☀️' },
  { id: 'dinner', label: 'Dinner', icon: '🌙' },
  { id: 'snack', label: 'Snack', icon: '🍎' },
] as const;

export const EXERCISE_CATEGORIES = [
  { id: 'cardio', label: 'Cardio', color: 'bg-rose-500' },
  { id: 'strength', label: 'Strength', color: 'bg-indigo-500' },
  { id: 'sport', label: 'Sport', color: 'bg-emerald-500' },
  { id: 'flexibility', label: 'Flexibility', color: 'bg-amber-500' },
] as const;

export const COMMUNITY_CHALLENGES: Challenge[] = [
  { id: 'step_master', title: '10k Steps Weekly', description: 'Hit 10,000 steps every day for 7 days.', participants: 1240, icon: '👣', reward: 'Elite Walker Badge', category: 'steps' },
  { id: 'hydro_king', title: 'Hydration Hero', description: 'Log at least 2.5L of water for 5 consecutive days.', participants: 856, icon: '💧', reward: 'Pure Energy Bonus', category: 'hydration' },
  { id: 'fast_tracker', title: 'Intermittent Fasting 101', description: 'Complete three 16:8 fasting windows.', participants: 2103, icon: '⏳', reward: 'Metabolic Master', category: 'weight' },
];
