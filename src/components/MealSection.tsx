import { MealEntry, MealType } from '../types/meal';
import { Coffee, UtensilsCrossed, Sandwich, Cookie, X } from 'lucide-react';

const mealIcons = {
  breakfast: Coffee,
  lunch: Sandwich,
  dinner: UtensilsCrossed,
  snack: Cookie,
};

const mealColors = {
  breakfast: 'bg-yellow-100 text-yellow-600',
  lunch: 'bg-green-100 text-green-600',
  dinner: 'bg-purple-100 text-purple-600',
  snack: 'bg-orange-100 text-orange-600',
};

interface MealSectionProps {
  type: MealType;
  meals: MealEntry[];
  onMealDelete: (id: string) => void;
}

export default function MealSection({ type, meals, onMealDelete }: MealSectionProps) {
  const Icon = mealIcons[type];
  const colorClass = mealColors[type];
  const filteredMeals = meals.filter(meal => meal.type === type);
  const totalCalories = filteredMeals.reduce((sum, meal) => sum + meal.calories, 0);

  if (filteredMeals.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 last:mb-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold capitalize text-gray-900">{type}</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total</p>
          <p className="font-semibold text-gray-900">{totalCalories} kcal</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredMeals.map((meal) => (
          <div
            key={meal.id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-all duration-200"
          >
            <p className="text-gray-800 font-medium">{meal.description}</p>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900">
                {meal.calories} kcal
              </span>
              <button
                onClick={() => onMealDelete(meal.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                aria-label="Delete meal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}