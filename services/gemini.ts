
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DietPlan, Recipe } from '../types';

// Initialize GoogleGenAI using a named parameter with process.env.API_KEY directly.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMealImage = async (base64Image: string) => {
  const ai = getAI();
  // Using the recommended { parts: [...] } structure for sending images and text together.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "Analyze this meal photo. Estimate the portion size and provide nutritional values (Calories, Protein, Carbs, Fats, Fiber). Be as accurate as possible for the items visible.",
        },
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fats: { type: Type.NUMBER },
          fiber: { type: Type.NUMBER },
        },
        required: ["name", "calories", "protein", "carbs", "fats"]
      },
    },
  });

  // Directly access the .text property to get the generated string.
  return JSON.parse(response.text || '{}');
};

export const generateProRecipes = async (profile: UserProfile, remainingMacros: string): Promise<Recipe[]> => {
  const ai = getAI();
  const prompt = `Based on a user aiming for ${profile.goal}, generate 3 healthy recipes. 
    User has ${remainingMacros} left for the day. Provide detailed ingredients and instructions.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER }
              }
            },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            time: { type: Type.STRING }
          },
          required: ["id", "title", "calories", "macros", "ingredients", "instructions", "time"]
        }
      },
    },
  });

  return JSON.parse(response.text || '[]');
};

export const analyzeMeal = async (description: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze: "${description}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fats: { type: Type.NUMBER },
        },
        required: ["name", "calories", "protein", "carbs", "fats"]
      },
    },
  });
  return JSON.parse(response.text || '{}');
};

export const searchFoodDatabase = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `List 5 matches for: "${query}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fats: { type: Type.NUMBER },
          },
          required: ["name", "calories", "protein", "carbs", "fats"]
        }
      },
    },
  });
  return JSON.parse(response.text || '[]');
};

export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Plan for ${profile.age}yo ${profile.gender}, goal ${profile.goal}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          sampleDay: {
            type: Type.OBJECT,
            properties: {
              breakfast: { type: Type.STRING },
              lunch: { type: Type.STRING },
              dinner: { type: Type.STRING },
              snacks: { type: Type.STRING }
            }
          }
        }
      },
    },
  });
  return JSON.parse(response.text || '{}');
};
