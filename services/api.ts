
import { UserProfile, DailyData, SubscriptionTier, Meal, Exercise } from '../types';

/**
 * API Service
 * This acts as the single point of contact for the frontend.
 * In a real app, these methods would perform fetch() requests to the Node.js/MongoDB server.
 */

const MOCK_DELAY = 800;

export const API = {
  // Authentication
  auth: {
    async login(email: string): Promise<UserProfile> {
      console.log(`[API] Logging in user: ${email}`);
      await new Promise(r => setTimeout(r, MOCK_DELAY));
      
      const stored = localStorage.getItem('fitpulse_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email === email) return parsed;
      }
      
      throw new Error("User not found or email mismatch");
    },

    async signup(data: any): Promise<UserProfile> {
      console.log(`[API] Registering user: ${data.email}`);
      await new Promise(r => setTimeout(r, MOCK_DELAY));
      
      const newUser: UserProfile = {
        name: data.name,
        email: data.email,
        age: 28,
        weight: 75,
        startWeight: 75,
        targetWeight: 70,
        height: 180,
        gender: 'male',
        activityLevel: 'moderately_active',
        goal: 'maintain', // Default until onboarding selection
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
      
      localStorage.setItem('fitpulse_user', JSON.stringify(newUser));
      return newUser;
    },

    logout() {
      // Just clear the session key. 
      // State reset in App.tsx will handle the UI transition.
      localStorage.removeItem('fitpulse_user');
    }
  },

  // User Profile
  user: {
    async update(profile: UserProfile): Promise<void> {
      console.log('[API] Updating user profile');
      localStorage.setItem('fitpulse_user', JSON.stringify(profile));
    },
    
    async upgrade(tier: SubscriptionTier): Promise<void> {
      const stored = localStorage.getItem('fitpulse_user');
      if (!stored) return;
      const profile = JSON.parse(stored);
      profile.subscriptionTier = tier;
      profile.isPremium = tier !== 'free';
      localStorage.setItem('fitpulse_user', JSON.stringify(profile));
    }
  },

  // Logs / Activities
  logs: {
    async getToday(): Promise<DailyData> {
      const date = new Date().toISOString().split('T')[0];
      const logs = JSON.parse(localStorage.getItem('fitpulse_logs') || '[]');
      const found = logs.find((l: any) => l.date === date);
      return found || { date, meals: [], exercises: [], steps: 0, waterIntake: 0, userId: 'current' };
    },

    async save(log: DailyData): Promise<void> {
      const logs = JSON.parse(localStorage.getItem('fitpulse_logs') || '[]');
      const index = logs.findIndex((l: any) => l.date === log.date);
      if (index !== -1) {
        logs[index] = log;
      } else {
        logs.push(log);
      }
      localStorage.setItem('fitpulse_logs', JSON.stringify(logs));
    }
  }
};
