import { MealEntry } from '../types/meal';
import MealSection from './MealSection';

interface MealListProps {
  meals: MealEntry[];
  onMealDelete: (id: string) => void;
}

export default function MealList({ meals, onMealDelete }: MealListProps) {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <div className="w-full max-w-2xl space-y-6">
      {meals.length > 0 && (
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-lg font-medium text-blue-900">
            Total Daily Calories: {totalCalories}
          </p>
        </div>
      )}
      
      <MealSection type="breakfast" meals={meals} onMealDelete={onMealDelete} />
      <MealSection type="lunch" meals={meals} onMealDelete={onMealDelete} />
      <MealSection type="snack" meals={meals} onMealDelete={onMealDelete} />
      <MealSection type="dinner" meals={meals} onMealDelete={onMealDelete} />
    </div>
  );
}