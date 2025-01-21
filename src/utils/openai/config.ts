import OpenAI from 'openai';
import { MealAnalysisError } from '../errors';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new MealAnalysisError('OpenAI API key not found. Please check your .env file.');
}

// Clean the API key and validate format
const cleanApiKey = apiKey.trim();
if (!cleanApiKey.startsWith('sk-')) {
  throw new MealAnalysisError('Invalid OpenAI API key format. The key should start with "sk-".');
}

export const openai = new OpenAI({
  apiKey: cleanApiKey,
  dangerouslyAllowBrowser: true,
  baseURL: 'https://api.openai.com/v1'
});