
export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ExerciseCategory = 'cardio' | 'strength' | 'flexibility' | 'sport';
export type SubscriptionTier = 'free' | 'pro' | 'elite';

export interface WeightLog {
  date: string; // YYYY-MM-DD
  weight: number;
}

export interface MacroGoals {
  protein: number;
  carbs: number;
  fats: number;
}

export interface UserProfile {
  _id?: string; // MongoDB ObjectId
  name: string;
  email: string;
  age: number;
  weight: number;
  startWeight: number;
  targetWeight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
  targetCalories: number;
  stepGoal: number;
  waterGoal: number;
  isPremium: boolean;
  subscriptionTier: SubscriptionTier;
  useNetCarbs: boolean;
  macroGoals: MacroGoals;
  trainingDayOffset: number;
  fastingGoal: number;
  activeChallenges: string[];
}

export interface Meal {
  id: string;
  timestamp: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  category: MealCategory;
}

export interface DailyData {
  _id?: string; // MongoDB ObjectId
  userId: string;
  date: string;
  meals: Meal[];
  exercises: Exercise[];
  steps: number;
  waterIntake: number;
  fastingStart?: number;
}

export interface Exercise {
  id: string;
  timestamp: number;
  name: string;
  duration: number;
  caloriesBurned: number;
  category?: ExerciseCategory;
}

export interface DietPlan {
  title: string;
  recommendations: string[];
  sampleDay: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
}

export interface Recipe {
  id: string;
  title: string;
  calories: number;
  macros: MacroGoals;
  ingredients: string[];
  instructions: string[];
  time: string;
}

// Added CustomFood interface for saved favorite foods
export interface CustomFood {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  icon: string;
  reward: string;
  category: 'steps' | 'hydration' | 'weight' | 'mindset';
}
