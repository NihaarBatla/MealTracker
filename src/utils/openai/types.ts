export interface OpenAIResponse {
  type: MealType;
  description: string;
  calories: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export const VALID_MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];