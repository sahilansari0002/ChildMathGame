import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, RotateCcw, Home } from 'lucide-react';
import { useAppStore } from '../../store';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Confetti from '../ui/Confetti';
import AnimatedNumber from '../ui/AnimatedNumber';
import { playSound } from '../../utils/helpers';

interface GameCompleteProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  onPlayAgain: () => void;
}

const GameComplete: React.FC<GameCompleteProps> = ({
  score,
  totalQuestions,
  correctAnswers,
  onPlayAgain,
}) => {
  const navigate = useNavigate();
  const { soundEnabled } = useAppStore();
  
  useEffect(() => {
    if (soundEnabled) {
      playSound('complete');
    }
  }, [soundEnabled]);
  
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  const getMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a genius! 🌟";
    if (percentage >= 70) return "Great job! You're doing amazing! 🎉";
    if (percentage >= 50) return "Good effort! Keep practicing! 👍";
    return "Nice try! Let's practice more! 💪";
  };
  
  return (
    <>
      <Confetti active={true} />
      
      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Trophy className="w-16 h-16 mx-auto text-accent-500 mb-4" />
          </motion.div>
          
          <motion.h1
            className="text-2xl font-bold mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Game Complete!
          </motion.h1>
          
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {getMessage()}
          </motion.p>
          
          <motion.div
            className="bg-primary-50 rounded-lg p-6 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Score:</span>
              <AnimatedNumber
                value={score}
                className="text-2xl font-bold text-primary-600"
                duration={1.5}
              />
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Correct Answers:</span>
              <div className="flex items-center">
                <AnimatedNumber
                  value={correctAnswers}
                  className="text-xl font-bold text-primary-600 mr-1"
                  duration={1}
                />
                <span className="text-gray-600">/ {totalQuestions}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Accuracy:</span>
              <div className="flex items-center">
                <AnimatedNumber
                  value={percentage}
                  className="text-xl font-bold text-primary-600"
                  duration={1}
                  suffix="%"
                />
                <Star className="w-5 h-5 text-accent-500 ml-1" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="flex flex-col space-y-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={onPlayAgain}
              variant="primary"
              fullWidth
              icon={<RotateCcw size={18} />}
            >
              Play Again
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              fullWidth
              icon={<Home size={18} />}
            >
              Back to Home
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </>
  );
};

export default GameComplete;