import { MealAnalysisError } from '../errors';
import { OpenAIResponse, VALID_MEAL_TYPES } from './types';

export function validateApiResponse(meal: OpenAIResponse) {
  // Validate meal type
  if (!meal.type || !VALID_MEAL_TYPES.includes(meal.type)) {
    throw new MealAnalysisError('Invalid meal type detected.');
  }

  // Validate description
  if (!meal.description || typeof meal.description !== 'string' || meal.description.trim() === '') {
    throw new MealAnalysisError('Invalid meal description.');
  }

  // Validate calories
  if (typeof meal.calories !== 'number' || meal.calories <= 0 || meal.calories > 5000) {
    throw new MealAnalysisError('Invalid calorie value.');
  }
}