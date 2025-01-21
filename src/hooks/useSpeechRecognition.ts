import { useState, useCallback } from 'react';
import { SpeechRecognitionService } from '../utils/speechRecognition';
import { MealAnalysisError } from '../utils/errors';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback((onTranscript: (text: string) => void) => {
    try {
      const recognition = new SpeechRecognitionService({
        onStart: () => {
          setIsListening(true);
          setError(null);
        },
        onResult: (transcript) => {
          onTranscript(transcript);
        },
        onError: (error) => {
          setError(error);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });

      recognition.start();
      return recognition;
    } catch (error) {
      if (error instanceof MealAnalysisError) {
        setError(error.message);
      } else {
        setError('Failed to initialize speech recognition');
      }
      return null;
    }
  }, []);

  return {
    isListening,
    error,
    startListening
  };
}