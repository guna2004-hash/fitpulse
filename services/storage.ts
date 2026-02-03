
import { STORAGE_KEYS } from '../constants';
import { UserProfile, DailyData, CustomFood, WeightLog } from '../types';

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

export const getProfile = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveDailyData = (logs: DailyData[]) => {
  localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
};

export const getDailyData = (): DailyData[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
  return data ? JSON.parse(data) : [];
};

export const saveCustomFoods = (foods: CustomFood[]) => {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(foods));
};

export const getCustomFoods = (): CustomFood[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_FOODS);
  return data ? JSON.parse(data) : [];
};

export const saveWeightHistory = (history: WeightLog[]) => {
  localStorage.setItem(STORAGE_KEYS.WEIGHT_HISTORY, JSON.stringify(history));
};

export const getWeightHistory = (): WeightLog[] => {
  const data = localStorage.getItem(STORAGE_KEYS.WEIGHT_HISTORY);
  return data ? JSON.parse(data) : [];
};

// Fixed fallback object to include required 'userId' property and correct array types
export const getTodayData = (logs: DailyData[]): DailyData => {
  const today = new Date().toISOString().split('T')[0];
  const found = logs.find(log => log.date === today);
  return found || { 
    userId: 'current', 
    date: today, 
    meals: [], 
    exercises: [], 
    steps: 0, 
    waterIntake: 0 
  };
};

export const updateDailyLog = (logs: DailyData[], newData: DailyData): DailyData[] => {
  const index = logs.findIndex(log => log.date === newData.date);
  if (index !== -1) {
    const updated = [...logs];
    updated[index] = newData;
    return updated;
  }
  return [...logs, newData];
};
