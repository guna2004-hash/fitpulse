
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  age: Number,
  weight: Number,
  startWeight: Number,
  targetWeight: Number,
  height: Number,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  goal: String,
  targetCalories: Number,
  subscriptionTier: { type: String, default: 'free' },
  macroGoals: {
    protein: Number,
    carbs: Number,
    fats: Number
  },
  weightHistory: [{
    date: String,
    weight: Number
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
