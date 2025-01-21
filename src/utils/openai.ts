import OpenAI from 'openai';
import { MealAnalysisError } from './errors';
import { validateApiKey } from './validation';
import { MealEntry, MealType } from '../types/meal';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface OpenAIResponse {
  type: MealType;
  description: string;
  calories: number;
}

export async function analyzeMeal(mealDescription: string): Promise<MealEntry> {
  try {
    validateApiKey(import.meta.env.VITE_OPENAI_API_KEY);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a nutritionist assistant that analyzes meal descriptions and categorizes them according to the users input. For each meal categorize them according to what the user says(eg. I had an apple for lunch) and estimate calories. Always respond with valid JSON containing: type (must be exactly one of: breakfast, lunch, dinner, snack), description (cleaned up user input), calories (reasonable estimate as number). Never include additional text or explanations."
        },
        {
          role: "user",
          content: mealDescription
        }
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 150
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new MealAnalysisError('Could not analyze meal. Please try again with a clearer description.');
    }

    let parsed: OpenAIResponse;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new MealAnalysisError('Could not understand the meal analysis. Please try again.');
    }
    
    // Validate response structure
    if (!parsed.type || !parsed.description || typeof parsed.calories !== 'number') {
      throw new MealAnalysisError('Could not properly analyze the meal. Please provide more details.');
    }

    // Validate meal type
    const validMealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
    if (!validMealTypes.includes(parsed.type)) {
      throw new MealAnalysisError('Invalid meal type detected. Please specify if this is breakfast, lunch, dinner, or a snack.');
    }

    // Validate calories
    if (parsed.calories <= 0 || parsed.calories > 5000) {
      throw new MealAnalysisError('Invalid calorie estimate. Please provide more specific meal details.');
    }

    return {
      id: crypto.randomUUID(),
      type: parsed.type,
      description: parsed.description,
      calories: Math.round(parsed.calories), // Round to whole numbers
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    if (error instanceof MealAnalysisError) {
      throw error;
    }
    if (error instanceof SyntaxError) {
      throw new MealAnalysisError('Could not understand the meal description. Please try again.');
    }
    if (error instanceof Error) {
      throw new MealAnalysisError(error.message || 'Failed to analyze meal. Please try again.');
    }
    throw new MealAnalysisError('An unexpected error occurred. Please try again with a different description.');
  }
}