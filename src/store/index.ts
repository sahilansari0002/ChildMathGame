import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Question, GameState, Badge, Language } from '../types';
import { generateUniqueId } from '../utils/helpers';

interface AppState {
  user: User | null;
  gameState: GameState | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  currentLanguage: Language;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  
  // Actions
  initializeUser: (name: string, avatar: string) => void;
  updateUser: (user: Partial<User>) => void;
  startGame: (gameMode: 'practice' | 'challenge' | 'multiplayer', questionType: 'math' | 'quiz' | 'guess', difficulty: 'easy' | 'medium' | 'hard', count: number) => void;
  answerQuestion: (answer: string | number) => void;
  completeGame: () => void;
  resetGame: () => void;
  toggleSound: () => void;
  toggleVoice: () => void;
  changeLanguage: (language: Language) => void;
  awardBadge: (badgeId: string) => void;
  addXp: (amount: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      gameState: null,
      isLoading: false,
      isAuthenticated: false,
      currentLanguage: 'english',
      soundEnabled: true,
      voiceEnabled: true,
      
      initializeUser: (name, avatar) => {
        const newUser: User = {
          id: generateUniqueId(),
          name,
          avatar,
          xp: 0,
          level: 1,
          badges: [],
          preferences: {
            language: 'english',
            voiceEnabled: true,
            soundEffects: true,
          },
          progress: {
            mathCompleted: 0,
            quizCompleted: 0,
            guessCompleted: 0,
          },
        };
        
        set({ user: newUser, isAuthenticated: true });
      },
      
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
      
      startGame: (gameMode, questionType, difficulty, count) => {
        const questions = generateQuestions(questionType, difficulty, count);
        
        const newGameState: GameState = {
          currentQuestion: 0,
          score: 0,
          lives: gameMode === 'challenge' ? 3 : Infinity,
          gameMode,
          questions,
          answers: Array(questions.length).fill(null),
          isComplete: false,
        };
        
        set({ gameState: newGameState });
      },
      
      answerQuestion: (answer) => {
        const { gameState, user } = get();
        if (!gameState || gameState.isComplete) return;
        
        const currentQuestionIndex = gameState.currentQuestion;
        const currentQuestion = gameState.questions[currentQuestionIndex];
        const isCorrect = checkAnswer(currentQuestion, answer);
        
        const newAnswers = [...gameState.answers];
        newAnswers[currentQuestionIndex] = answer;
        
        let newScore = gameState.score;
        let newLives = gameState.lives;
        
        if (isCorrect) {
          // Increase points based on difficulty and remaining time
          const difficultyMultiplier = 
            currentQuestion.difficulty === 'easy' ? 1 :
            currentQuestion.difficulty === 'medium' ? 2 : 3;
          
          newScore += currentQuestion.points * difficultyMultiplier;
        } else if (gameState.gameMode === 'challenge') {
          newLives -= 1;
        }
        
        const isLastQuestion = currentQuestionIndex === gameState.questions.length - 1;
        const isGameOver = newLives <= 0;
        
        const newGameState: GameState = {
          ...gameState,
          currentQuestion: isLastQuestion || isGameOver ? currentQuestionIndex : currentQuestionIndex + 1,
          score: newScore,
          lives: newLives,
          answers: newAnswers,
          isComplete: isLastQuestion || isGameOver,
        };
        
        set({ gameState: newGameState });
        
        if (newGameState.isComplete && user) {
          const questionType = currentQuestion.type;
          const progressKey = `${questionType}Completed` as keyof typeof user.progress;
          
          const updatedProgress = {
            ...user.progress,
            [progressKey]: (user.progress[progressKey] as number) + 1,
          };
          
          get().updateUser({ progress: updatedProgress });
          get().addXp(newScore);
        }
      },
      
      completeGame: () => {
        const { gameState } = get();
        if (!gameState) return;
        
        set({
          gameState: {
            ...gameState,
            isComplete: true,
          },
        });
      },
      
      resetGame: () => {
        set({ gameState: null });
      },
      
      toggleSound: () => {
        const { soundEnabled, user } = get();
        set({ soundEnabled: !soundEnabled });
        
        if (user) {
          get().updateUser({
            preferences: {
              ...user.preferences,
              soundEffects: !soundEnabled,
            },
          });
        }
      },
      
      toggleVoice: () => {
        const { voiceEnabled, user } = get();
        set({ voiceEnabled: !voiceEnabled });
        
        if (user) {
          get().updateUser({
            preferences: {
              ...user.preferences,
              voiceEnabled: !voiceEnabled,
            },
          });
        }
      },
      
      changeLanguage: (language) => {
        const { user } = get();
        set({ currentLanguage: language });
        
        if (user) {
          get().updateUser({
            preferences: {
              ...user.preferences,
              language,
            },
          });
        }
      },
      
      awardBadge: (badgeId) => {
        const { user } = get();
        if (!user) return;
        
        const existingBadge = user.badges.find(badge => badge.id === badgeId);
        
        if (existingBadge && !existingBadge.unlocked) {
          const updatedBadges = user.badges.map(badge => 
            badge.id === badgeId 
              ? { ...badge, unlocked: true, unlockedAt: new Date() } 
              : badge
          );
          
          get().updateUser({ badges: updatedBadges });
        } else if (!existingBadge) {
          const newBadge: Badge = {
            id: badgeId,
            name: 'New Badge',
            description: 'You earned a new badge!',
            icon: '🏆',
            unlocked: true,
            unlockedAt: new Date(),
          };
          
          get().updateUser({ badges: [...user.badges, newBadge] });
        }
      },
      
      addXp: (amount) => {
        const { user } = get();
        if (!user) return;
        
        const currentXp = user.xp;
        const newXp = currentXp + amount;
        const newLevel = 1 + Math.floor(newXp / 100);
        const leveledUp = newLevel > user.level;
        
        get().updateUser({ xp: newXp, level: newLevel });
        
        if (leveledUp) {
          get().awardBadge(`level-${newLevel}`);
        }
      },
    }),
    {
      name: 'gyan-guru-storage',
      partialize: (state) => ({
        user: state.user,
        currentLanguage: state.currentLanguage,
        soundEnabled: state.soundEnabled,
        voiceEnabled: state.voiceEnabled,
      }),
    }
  )
);

// Helper functions
function generateQuestions(type: 'math' | 'quiz' | 'guess', difficulty: 'easy' | 'medium' | 'hard', count: number): Question[] {
  switch (type) {
    case 'math':
      return generateMathQuestions(difficulty, count);
    case 'quiz':
      return generateQuizQuestions(difficulty, count);
    case 'guess':
      return generateGuessQuestions(difficulty, count);
    default:
      return [];
  }
}

function generateMathQuestions(difficulty: 'easy' | 'medium' | 'hard', count: number): Question[] {
  const questions: Question[] = [];
  const operations: ('addition' | 'subtraction' | 'multiplication' | 'division' | 'sequence' | 'fractions' | 'decimals' | 'percentages')[] = 
    ['addition', 'subtraction', 'multiplication', 'division', 'sequence', 'fractions', 'decimals', 'percentages'];
  
  for (let i = 0; i < count; i++) {
    const operation = operations[Math.floor(Math.random() * (difficulty === 'easy' ? 5 : operations.length))];
    let num1, num2, answer, question;
    
    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case 'medium':
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * 20) + 5;
        break;
      case 'hard':
        num1 = Math.floor(Math.random() * 100) + 20;
        num2 = Math.floor(Math.random() * 50) + 10;
        break;
    }
    
    switch (operation) {
      case 'addition':
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        break;
      case 'subtraction':
        if (num1 < num2) [num1, num2] = [num2, num1];
        answer = num1 - num2;
        question = `${num1} - ${num2} = ?`;
        break;
      case 'multiplication':
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        break;
      case 'division':
        answer = num2;
        num1 = num1 * num2;
        question = `${num1} ÷ ${num2} = ?`;
        break;
      case 'sequence':
        const step = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 5;
        const start = difficulty === 'easy' ? num1 : difficulty === 'medium' ? num1 * 2 : num1 * 3;
        const sequence = Array.from({ length: 4 }, (_, i) => start + i * step);
        answer = start + 4 * step;
        question = `What comes next in the sequence? ${sequence.join(', ')}, ?`;
        break;
      case 'fractions':
        if (difficulty === 'easy') {
          num1 = Math.floor(Math.random() * 4) + 1;
          num2 = 4;
        } else if (difficulty === 'medium') {
          num1 = Math.floor(Math.random() * 6) + 1;
          num2 = 6;
        } else {
          num1 = Math.floor(Math.random() * 8) + 1;
          num2 = 8;
        }
        answer = (num1 / num2) * 100;
        question = `Convert the fraction ${num1}/${num2} to a percentage`;
        break;
      case 'decimals':
        if (difficulty === 'easy') {
          num1 = Math.floor(Math.random() * 100) / 10;
          num2 = Math.floor(Math.random() * 100) / 10;
        } else if (difficulty === 'medium') {
          num1 = Math.floor(Math.random() * 1000) / 100;
          num2 = Math.floor(Math.random() * 1000) / 100;
        } else {
          num1 = Math.floor(Math.random() * 10000) / 1000;
          num2 = Math.floor(Math.random() * 10000) / 1000;
        }
        answer = num1 + num2;
        question = `${num1.toFixed(2)} + ${num2.toFixed(2)} = ?`;
        break;
      case 'percentages':
        if (difficulty === 'easy') {
          num1 = Math.floor(Math.random() * 100) + 1;
          num2 = 10;
        } else if (difficulty === 'medium') {
          num1 = Math.floor(Math.random() * 1000) + 1;
          num2 = 25;
        } else {
          num1 = Math.floor(Math.random() * 10000) + 1;
          num2 = 75;
        }
        answer = (num1 * num2) / 100;
        question = `What is ${num2}% of ${num1}?`;
        break;
      default:
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
    }
    
    const options = generateOptions(answer, difficulty);
    
    questions.push({
      id: generateUniqueId(),
      type: 'math',
      difficulty,
      points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15,
      timeLimit: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60,
      content: {
        question,
        options,
        correctAnswer: answer,
        operation,
      },
    });
  }
  
  return questions;
}

function generateQuizQuestions(difficulty: 'easy' | 'medium' | 'hard', count: number): Question[] {
  const quizQuestions = [
    {
      question: "Which is the national animal of India?",
      options: ["Lion", "Tiger", "Elephant", "Peacock"],
      correctAnswer: "Tiger",
      category: "general",
      imageUrl: "https://images.unsplash.com/photo-1615824996195-f780bba7f32b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      explanation: "The Bengal Tiger was declared as the national animal of India in 1973."
    },
    {
      question: "Which festival is known as the 'Festival of Lights'?",
      options: ["Holi", "Diwali", "Durga Puja", "Eid"],
      correctAnswer: "Diwali",
      category: "culture",
      imageUrl: "https://images.unsplash.com/photo-1574265932589-955bdbb0b3a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      explanation: "Diwali symbolizes the spiritual victory of light over darkness and good over evil."
    },
    {
      question: "Which is the largest state in India by area?",
      options: ["Maharashtra", "Madhya Pradesh", "Uttar Pradesh", "Rajasthan"],
      correctAnswer: "Rajasthan",
      category: "geography",
      imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      explanation: "Rajasthan, covering 342,239 square kilometers, is India's largest state by area."
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Jupiter", "Mars", "Saturn"],
      correctAnswer: "Mars",
      category: "science",
      imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      explanation: "Mars appears red due to iron oxide (rust) on its surface."
    },
    {
      question: "Which is the national flower of India?",
      options: ["Rose", "Lotus", "Sunflower", "Lily"],
      correctAnswer: "Lotus",
      category: "general",
      imageUrl: "https://images.unsplash.com/photo-1606293926249-ed2331ab6558?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      explanation: "The Lotus represents purity, prosperity, and spirituality in Indian culture."
    },
    {
      question: "Which Indian city is known as the 'Pink City'?",
      options: ["Jaipur", "Jodhpur", "Udaipur", "Bikaner"],
      correctAnswer: "Jaipur",
      category: "geography",
      imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      explanation: "Jaipur is called the Pink City due to the pink-colored buildings in its old city area."
    },
    {
      question: "Which sport is Sachin Tendulkar associated with?",
      options: ["Hockey", "Cricket", "Football", "Badminton"],
      correctAnswer: "Cricket",
      category: "sports",
      imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      explanation: "Sachin Tendulkar is known as the 'God of Cricket' and holds numerous cricket records."
    },
    {
      question: "Which is the longest river in India?",
      options: ["Yamuna", "Brahmaputra", "Ganga", "Godavari"],
      correctAnswer: "Ganga",
      category: "geography",
      imageUrl: "https://images.unsplash.com/photo-1591018533273-5a45e534a05d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      explanation: "The Ganga River, stretching over 2,525 kilometers, is India's longest river."
    },
    {
      question: "Which is the smallest planet in our solar system?",
      options: ["Mars", "Mercury", "Venus", "Pluto"],
      correctAnswer: "Mercury",
      category: "science",
      imageUrl: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      explanation: "Mercury is the smallest and innermost planet in the Solar System."
    },
    {
      question: "Which gas do plants absorb from the air?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      correctAnswer: "Carbon Dioxide",
      category: "science",
      imageUrl: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      explanation: "Plants absorb carbon dioxide during photosynthesis to produce food and oxygen."
    },
    {
      question: "Who wrote India's national anthem?",
      options: ["Rabindranath Tagore", "Bankim Chandra Chattopadhyay", "Sarojini Naidu", "Mahatma Gandhi"],
      correctAnswer: "Rabindranath Tagore",
      category: "culture",
      imageUrl: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      explanation: "Jana Gana Mana was written by Rabindranath Tagore in Bengali and adopted as India's national anthem in 1950."
    },
    {
      question: "Which is the hardest natural substance?",
      options: ["Gold", "Iron", "Diamond", "Platinum"],
      correctAnswer: "Diamond",
      category: "science",
      imageUrl: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      explanation: "Diamond is the hardest known natural material on Earth."
    }
  ];
  
  // Filter questions based on difficulty
  let filteredQuestions = [...quizQuestions];
  if (difficulty === 'easy') {
    filteredQuestions = quizQuestions.filter(q => ['general', 'culture'].includes(q.category));
  } else if (difficulty === 'medium') {
    filteredQuestions = quizQuestions.filter(q => ['geography', 'sports'].includes(q.category));
  } else {
    filteredQuestions = quizQuestions.filter(q => ['science', 'history'].includes(q.category));
  }
  
  // Select random questions based on count
  const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  return selected.map(q => ({
    id: generateUniqueId(),
    type: 'quiz',
    difficulty,
    points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15,
    timeLimit: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60,
    content: {
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      category: q.category as any,
      imageUrl: q.imageUrl,
      explanation: q.explanation,
    },
  }));
}

function generateGuessQuestions(difficulty: 'easy' | 'medium' | 'hard', count: number): Question[] {
  const guessQuestions = [
    {
      hint: "One of the seven wonders of the world",
      correctAnswer: "Taj Mahal",
      imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      category: "monuments"
    },
    {
      hint: "National bird of India",
      correctAnswer: "Peacock",
      imageUrl: "https://images.unsplash.com/photo-1511208687438-2c5a5abb810c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      category: "animals"
    },
    {
      hint: "King of fruits",
      correctAnswer: "Mango",
      imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      category: "fruits"
    },
    {
      hint: "Festival of colors",
      correctAnswer: "Holi",
      imageUrl: "https://images.unsplash.com/photo-1592234403516-69701d156517?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      category: "festivals"
    },
    {
      hint: "Most popular sport in India",
      correctAnswer: "Cricket",
      imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      category: "sports"
    },
    {
      hint: "Famous fort in Delhi",
      correctAnswer: "Red Fort",
      imageUrl: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      category: "monuments"
    },
    {
      hint: "Sacred river in India",
      correctAnswer: "Ganga",
      imageUrl: "https://images.unsplash.com/photo-1591018533273-5a45e534a05d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      category: "geography"
    },
    {
      hint: "Yellow curved fruit",
      correctAnswer: "Banana",
      imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      category: "fruits"
    },
    {
      hint: "Festival of lights",
      correctAnswer: "Diwali",
      imageUrl: "https://images.unsplash.com/photo-1574265932589-955bdbb0b3a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      category: "festivals"
    },
    {
      hint: "National animal of India",
      correctAnswer: "Tiger",
      imageUrl: "https://images.unsplash.com/photo-1615824996195-f780bba7f32b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      category: "animals"
    },
    {
      hint: "Famous temple in South India",
      correctAnswer: "Meenakshi Temple",
      imageUrl: "https://images.unsplash.com/photo-1582651957695-5c1c3c21fdf0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      category: "monuments"
    },
    {
      hint: "Traditional Indian martial art",
      correctAnswer: "Kalaripayattu",
      imageUrl: "https://images.unsplash.com/photo-1583321500900-82807e458f3c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      category: "sports"
    }
  ];
  
  // Filter questions based on difficulty
  let filteredQuestions = [...guessQuestions];
  if (difficulty === 'easy') {
    filteredQuestions = guessQuestions.filter(q => ['fruits', 'animals'].includes(q.category));
  } else if (difficulty === 'medium') {
    filteredQuestions = guessQuestions.filter(q => ['festivals', 'sports'].includes(q.category));
  } else {
    filteredQuestions = guessQuestions.filter(q => ['monuments', 'geography'].includes(q.category));
  }
  
  // Select random questions based on count
  const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  return selected.map(q => ({
    id: generateUniqueId(),
    type: 'guess',
    difficulty,
    points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15,
    timeLimit: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60,
    content: {
      hint: q.hint,
      correctAnswer: q.correctAnswer,
      imageUrl: q.imageUrl,
      category: q.category as any,
      options: generateGuessOptions(q.correctAnswer, q.category as any),
    },
  }));
}

function generateOptions(answer: number, difficulty: 'easy' | 'medium' | 'hard'): string[] {
  const options: number[] = [answer];
  const range = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20;
  
  while (options.length < 4) {
    const option = answer + Math.floor(Math.random() * range * 2) - range;
    if (!options.includes(option) && option >= 0) {
      options.push(option);
    }
  }
  
  return options.sort(() => 0.5 - Math.random()).map(String);
}

function generateGuessOptions(answer: string, category: string): string[] {
  const optionsByCategory: Record<string, string[]> = {
    monuments: ['Taj Mahal', 'Red Fort', 'Qutub Minar', 'India Gate', 'Gateway of India', 'Hawa Mahal', 'Meenakshi Temple', 'Konark Sun Temple'],
    animals: ['Tiger', 'Lion', 'Elephant', 'Peacock', 'Monkey', 'Cow', 'Deer', 'Rhinoceros'],
    fruits: ['Mango', 'Banana', 'Apple', 'Orange', 'Grapes', 'Watermelon', 'Papaya', 'Pomegranate'],
    festivals: ['Diwali', 'Holi', 'Dussehra', 'Eid', 'Christmas', 'Navratri', 'Janmashtami', 'Onam'],
    sports: ['Cricket', 'Football', 'Hockey', 'Badminton', 'Kabaddi', 'Tennis', 'Chess', 'Kalaripayattu'],
    geography: ['Ganga', 'Yamuna', 'Brahmaputra', 'Himalaya', 'Thar Desert', 'Western Ghats', 'Eastern Ghats', 'Sundarbans'],
  };
  
  const categoryOptions = optionsByCategory[category] || optionsByCategory.monuments;
  const filteredOptions = categoryOptions.filter(opt => opt !== answer);
  const shuffled = [...filteredOptions].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  
  return [...selected, answer].sort(() => 0.5 - Math.random());
}

function checkAnswer(question: Question, answer: string | number): boolean {
  const correctAnswer = question.content.correctAnswer;
  
  if (typeof correctAnswer === 'number' && typeof answer === 'number') {
    return correctAnswer === answer;
  }
  
  if (typeof correctAnswer === 'string' && typeof answer === 'string') {
    return correctAnswer.toLowerCase() === answer.toLowerCase();
  }
  
  return String(correctAnswer) === String(answer);
}