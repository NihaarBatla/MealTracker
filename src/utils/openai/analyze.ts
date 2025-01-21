import { MealAnalysisError } from '../errors';
import crypto from 'crypto';
import { openai } from './config';
import { SYSTEM_PROMPT } from './prompts';
import { validateApiResponse } from './validation';
import { MealEntry, MealType } from '../../types/meal';

export async function analyzeMeal(mealDescription: string): Promise<MealEntry[]> {
  if (!mealDescription?.trim()) {
    throw new MealAnalysisError('Please provide a meal description.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: mealDescription }
      ],
      response_format: { type: "json_object" }, // Force JSON response
      temperature: 0.3,
      max_tokens: 500
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      console.error('Empty response from OpenAI');
      throw new MealAnalysisError('No response received from the analysis.');
    }

    // Log the raw content for debugging
    console.log('Raw Response Content:', content);

    let parsed: { meals: { type: MealType; description: string; calories: number }[] };
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      console.error('JSON Parse Error:', error, 'Content:', content);
      throw new MealAnalysisError('Invalid JSON response from the analysis.');
    }

    if (!parsed.meals || !Array.isArray(parsed.meals)) {
      console.error('Invalid Response Structure:', parsed);
      throw new MealAnalysisError('Unexpected response structure from the analysis.');
    }

    const entries: MealEntry[] = [];
    for (const meal of parsed.meals) {
      try {
        // Log the meal being validated
        console.log('Validating meal:', meal);
        
        // Validate the meal object
        validateApiResponse(meal);

        // Push a validated meal entry
        entries.push({
          id: crypto.randomUUID(),
          type: meal.type,
          description: meal.description,
          calories: Math.round(meal.calories),
          timestamp: new Date().toISOString()
        });
      } catch (validationError) {
        console.error('Validation Error for Meal:', meal, validationError);
      }
    }

    if (entries.length === 0) {
      throw new MealAnalysisError('No valid meals could be analyzed from the description.');
    }

    return entries;

  } catch (error: unknown) {
    // Log the complete error object
    if (error instanceof Error) {
      console.error('OpenAI API Error:', {
        error,
        status: (error as { status?: number }).status,
        message: error.message,
        response: (error as { response?: unknown }).response
      });
    } else {
      console.error('OpenAI API Error:', error);
    }

    if (error instanceof MealAnalysisError) {
      throw error;
    }

    // Check for specific OpenAI error types
    const apiError = error as { code?: string; status?: number };

    if (apiError.code === 'invalid_api_key') {
      throw new MealAnalysisError('Invalid API key. Please check your configuration.');
    }

    if (apiError.status === 401 || apiError.status === 403) {
      throw new MealAnalysisError('Authentication failed. Please check your API key.');
    }

    if (apiError.status === 429) {
      throw new MealAnalysisError('Too many requests. Please try again in a moment.');
    }

    if (apiError.status === 500) {
      throw new MealAnalysisError('OpenAI service error. Please try again later.');
    }

    throw new MealAnalysisError('Unexpected error during meal analysis. Please try again.');
  }
}