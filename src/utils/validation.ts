import { MealAnalysisError } from './errors';

export function validateApiKey(apiKey: string | undefined): void {
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new MealAnalysisError('OpenAI API key not configured. Please add your API key to the .env file.');
  }
}