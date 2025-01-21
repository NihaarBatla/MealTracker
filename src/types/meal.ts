export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealEntry {
  id: string;
  type: MealType;
  description: string;
  calories: number;
  timestamp: string;
}