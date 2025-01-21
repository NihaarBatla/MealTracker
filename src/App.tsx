import { useState } from 'react';
import { Utensils, Calendar, Activity, Settings } from 'lucide-react';
import MealInput from './components/MealInput';
import MealList from './components/MealList';
import { Modal } from './components/Modal';
import { MealEntry } from './types/meal';

export default function App() {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempCalorieGoal, setTempCalorieGoal] = useState(calorieGoal);

  const handleMealAdd = (mealEntries: MealEntry[]) => {
    const mealsWithSelectedDate = mealEntries.map(meal => ({
      ...meal,
      timestamp: new Date(`${selectedDate}T12:00:00`).toISOString()
    }));
    setMeals((prev) => [...mealsWithSelectedDate, ...prev]);
  };

  const handleMealDelete = (mealId: string) => {
    setMeals((prev) => prev.filter(meal => meal.id !== mealId));
  };

  const handleSaveCalorieGoal = () => {
    setCalorieGoal(tempCalorieGoal);
    setIsSettingsOpen(false);
  };

  const filteredMeals = meals.filter(meal => {
    const mealDate = new Date(meal.timestamp).toISOString().split('T')[0];
    return mealDate === selectedDate;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalDailyCalories = filteredMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const calorieProgress = (totalDailyCalories / calorieGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-blue-600 rounded-full mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">NutriTrack Pro</h1>
          <p className="text-gray-600">
            Your Personal Nutrition Assistant
          </p>
        </div>

        {/* Date Selector and Calorie Goal */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-none focus:ring-2 focus:ring-blue-500 rounded-lg text-gray-700 font-medium"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Daily Progress</p>
                <p className="text-lg font-semibold text-gray-900">
                  {totalDailyCalories} / {calorieGoal} kcal
                </p>
              </div>
              <button
                onClick={() => {
                  setTempCalorieGoal(calorieGoal);
                  setIsSettingsOpen(true);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Adjust calorie goal"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(calorieProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Meal Input */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Add Meal</h2>
          </div>
          <MealInput onMealAdd={handleMealAdd} />
        </div>

        {/* Meal List */}
        {filteredMeals.length > 0 ? (
          <MealList meals={filteredMeals} onMealDelete={handleMealDelete} />
        ) : (
          <div className="text-center bg-white rounded-2xl shadow-lg p-8">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
              <Utensils className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600">
              No meals tracked for {formatDate(selectedDate)}. Start by adding your first meal!
            </p>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Adjust Daily Calorie Goal"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="calorieGoal" className="block text-sm font-medium text-gray-700 mb-1">
              Daily Calorie Goal
            </label>
            <input
              type="number"
              id="calorieGoal"
              min="500"
              max="10000"
              value={tempCalorieGoal}
              onChange={(e) => setTempCalorieGoal(Math.max(500, Math.min(10000, Number(e.target.value))))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              Recommended daily calorie intake ranges from 1,600 to 3,000 calories.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCalorieGoal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}