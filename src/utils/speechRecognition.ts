import { MealAnalysisError } from './errors';

interface SpeechRecognitionConfig {
  onStart: () => void;
  onResult: (transcript: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private silenceTimeout: NodeJS.Timeout | null = null;

  constructor(private config: SpeechRecognitionConfig) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new MealAnalysisError('Speech recognition is not supported in this browser');
    }
    
    this.recognition = new SpeechRecognition();
    this.setupRecognition();
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;

    this.recognition.onstart = () => {
      this.config.onStart();
      this.startSilenceDetection();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.resetSilenceDetection();
      this.config.onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      this.config.onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.config.onEnd();
      this.clearSilenceDetection();
    };
  }

  private startSilenceDetection() {
    this.silenceTimeout = setTimeout(() => {
      this.stop();
    }, 3000);
  }

  private resetSilenceDetection() {
    this.clearSilenceDetection();
    this.startSilenceDetection();
  }

  private clearSilenceDetection() {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
  }

  public start() {
    if (!this.recognition) return;
    this.recognition.start();
  }

  public stop() {
    if (!this.recognition) return;
    this.recognition.stop();
    this.clearSilenceDetection();
  }
}