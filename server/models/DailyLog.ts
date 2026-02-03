
import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  category: String,
  timestamp: Number
});

const exerciseSchema = new mongoose.Schema({
  name: String,
  duration: Number,
  caloriesBurned: Number,
  category: String,
  timestamp: Number
});

const dailyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  meals: [mealSchema],
  exercises: [exerciseSchema],
  steps: { type: Number, default: 0 },
  waterIntake: { type: Number, default: 0 },
  fastingStart: Number
}, { timestamps: true });

// Ensure unique log per user per day
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyLog', dailyLogSchema);
