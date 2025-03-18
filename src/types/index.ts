export interface User {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  badges: Badge[];
  preferences: {
    language: Language;
    voiceEnabled: boolean;
    soundEffects: boolean;
  };
  progress: {
    mathCompleted: number;
    quizCompleted: number;
    guessCompleted: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export type Language = 'english' | 'hindi' | 'marathi' | 'tamil' | 'bengali';

export interface Question {
  id: string;
  type: 'math' | 'quiz' | 'guess';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit?: number; // in seconds
  content: MathQuestion | QuizQuestion | GuessQuestion;
}

export interface MathQuestion {
  question: string;
  options?: string[];
  correctAnswer: string | number;
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'sequence';
  imageUrl?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  imageUrl?: string;
  category: 'general' | 'science' | 'history' | 'geography' | 'culture';
}

export interface GuessQuestion {
  hint?: string;
  options?: string[];
  correctAnswer: string;
  imageUrl: string;
  category: 'monuments' | 'animals' | 'fruits' | 'festivals' | 'sports';
}

export interface GameState {
  currentQuestion: number;
  score: number;
  timeRemaining?: number;
  lives: number;
  gameMode: 'practice' | 'challenge' | 'multiplayer';
  questions: Question[];
  answers: (string | number | null)[];
  isComplete: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'score' | 'games' | 'streak' | 'time';
    value: number;
  };
  reward: {
    xp: number;
    badge?: Badge;
  };
}