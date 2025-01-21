import React, { useState } from 'react';
import { Mic, Send } from 'lucide-react';
import { analyzeMeal } from '../utils/openai';
import { MealAnalysisError } from '../utils/errors';
import { MealEntry } from '../types/meal';
import { ErrorMessage } from './ErrorMessage';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface MealInputProps {
  onMealAdd: (meals: MealEntry[]) => void;
}

export default function MealInput({ onMealAdd }: MealInputProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isListening, error: speechError, startListening } = useSpeechRecognition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const analyzedMeals = await analyzeMeal(input);
      onMealAdd([analyzedMeals]);
      setInput('');
    } catch (error) {
      setError(error instanceof MealAnalysisError ? error.message : 'Could not analyze the meal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (!isListening) {
      startListening((transcript) => {
        setInput(transcript);
      });
    }
  };

  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your meal... (e.g., 'I had a chicken sandwich with fries for lunch')"
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-xl transition-all duration-200 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          disabled={isLoading}
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          disabled={isLoading || !input.trim()}
        >
          <Send className="w-5 h-5" />
          {isLoading ? 'Analyzing...' : 'Add'}
        </button>
      </form>
      {(error || speechError) && (
        <ErrorMessage message={error || speechError || ''} />
      )}
    </div>
  );
}