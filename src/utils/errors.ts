export class MealAnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MealAnalysisError';
  }
}

export function handleOpenAIError(error: any): never {
  if (error.code === 'invalid_api_key') {
    throw new MealAnalysisError('Invalid OpenAI API key. Please check your API key in the .env file.');
  }
  throw new MealAnalysisError('Failed to analyze meal. Please try again later.');
}