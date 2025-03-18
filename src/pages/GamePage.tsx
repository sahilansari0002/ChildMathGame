import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import MathQuestion from '../components/game/MathQuestion';
import QuizQuestion from '../components/game/QuizQuestion';
import GuessQuestion from '../components/game/GuessQuestion';
import GameComplete from '../components/game/GameComplete';
import GameControls from '../components/game/GameControls';
import { Question } from '../types';
import { playSound } from '../utils/helpers';

const GamePage: React.FC = () => {
  const { type = 'math' } = useParams<{ type: 'math' | 'quiz' | 'guess' }>();
  const navigate = useNavigate();
  const {
    startGame,
    gameState,
    answerQuestion,
    resetGame,
    isAuthenticated,
    soundEnabled,
  } = useAppStore();
  
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameMode, setGameMode] = useState<'practice' | 'challenge' | 'multiplayer'>('practice');
  const [isPaused, setIsPaused] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    return () => {
      // Clean up game state when leaving the page
      resetGame();
    };
  }, [resetGame]);
  
  const handleStartGame = () => {
    startGame(gameMode, type as any, difficulty, 10);
    setIsSetupComplete(true);
    
    if (soundEnabled) {
      playSound('click');
    }
  };
  
  const handleAnswer = (answer: string | number) => {
    answerQuestion(answer);
  };
  
  const handlePlayAgain = () => {
    setIsSetupComplete(false);
    resetGame();
  };
  
  const handleTogglePause = () => {
    setIsPaused(!isPaused);
    
    if (soundEnabled) {
      playSound('click');
    }
  };
  
  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'math':
        return (
          <MathQuestion
            question={question.content}
            onAnswer={handleAnswer}
            timeLimit={isPaused ? undefined : question.timeLimit}
          />
        );
      case 'quiz':
        return (
          <QuizQuestion
            question={question.content}
            onAnswer={handleAnswer}
            timeLimit={isPaused ? undefined : question.timeLimit}
          />
        );
      case 'guess':
        return (
          <GuessQuestion
            question={question.content}
            onAnswer={handleAnswer}
            timeLimit={isPaused ? undefined : question.timeLimit}
          />
        );
      default:
        return null;
    }
  };
  
  const getGameTitle = () => {
    switch (type) {
      case 'math':
        return 'Math Puzzles';
      case 'quiz':
        return 'Knowledge Quiz';
      case 'guess':
        return 'Guess the Image';
      default:
        return 'Game';
    }
  };
  
  if (!isSetupComplete) {
    return (
      <Layout>
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <h1 className="text-2xl font-bold mb-6 text-center">
              {getGameTitle()}
            </h1>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Select Difficulty:</h2>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => setDifficulty('easy')}
                  variant={difficulty === 'easy' ? 'primary' : 'outline'}
                  fullWidth
                >
                  Easy
                </Button>
                <Button
                  onClick={() => setDifficulty('medium')}
                  variant={difficulty === 'medium' ? 'primary' : 'outline'}
                  fullWidth
                >
                  Medium
                </Button>
                <Button
                  onClick={() => setDifficulty('hard')}
                  variant={difficulty === 'hard' ? 'primary' : 'outline'}
                  fullWidth
                >
                  Hard
                </Button>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Select Game Mode:</h2>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setGameMode('practice')}
                  variant={gameMode === 'practice' ? 'primary' : 'outline'}
                  fullWidth
                >
                  Practice
                </Button>
                <Button
                  onClick={() => setGameMode('challenge')}
                  variant={gameMode === 'challenge' ? 'primary' : 'outline'}
                  fullWidth
                >
                  Challenge
                </Button>
              </div>
            </div>
            
            <Button
              onClick={handleStartGame}
              variant="primary"
              size="lg"
              fullWidth
            >
              Start Game
            </Button>
          </Card>
        </motion.div>
      </Layout>
    );
  }
  
  if (!gameState) {
    return (
      <Layout>
        <div className="text-center">
          <p>Loading game...</p>
        </div>
      </Layout>
    );
  }
  
  if (gameState.isComplete) {
    const correctAnswers = gameState.answers.filter((answer, index) => {
      const question = gameState.questions[index];
      return String(answer) === String(question.content.correctAnswer);
    }).length;
    
    return (
      <Layout>
        <GameComplete
          score={gameState.score}
          totalQuestions={gameState.questions.length}
          correctAnswers={correctAnswers}
          onPlayAgain={handlePlayAgain}
        />
      </Layout>
    );
  }
  
  const currentQuestion = gameState.questions[gameState.currentQuestion];
  
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <GameControls
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
          />
        </div>
        
        <div className="mb-4 flex justify-between items-center">
          <span className="badge badge-primary">
            Question {gameState.currentQuestion + 1} of {gameState.questions.length}
          </span>
          
          <span className="badge badge-accent">
            Score: {gameState.score}
          </span>
          
          {gameMode === 'challenge' && (
            <span className="badge badge-secondary">
              Lives: {gameState.lives}
            </span>
          )}
        </div>
        
        {renderQuestion(currentQuestion)}
      </div>
    </Layout>
  );
};

export default GamePage;