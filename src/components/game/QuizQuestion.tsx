import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { QuizQuestion as QuizQuestionType } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Timer from '../ui/Timer';
import { speak } from '../../utils/speechUtils';
import { getLanguageCode, playSound } from '../../utils/helpers';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (answer: string) => void;
  timeLimit?: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  timeLimit,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const { voiceEnabled, currentLanguage, soundEnabled } = useAppStore();
  
  useEffect(() => {
    if (voiceEnabled) {
      speak(question.question, getLanguageCode(currentLanguage));
    }
  }, [question, voiceEnabled, currentLanguage]);
  
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };
  
  const handleSubmit = () => {
    if (!selectedOption) return;
    
    const correct = question.correctAnswer === selectedOption;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (soundEnabled) {
      playSound(correct ? 'correct' : 'wrong');
    }
    
    setTimeout(() => {
      onAnswer(selectedOption);
      setSelectedOption(null);
      setShowFeedback(false);
      setIsCorrect(null);
    }, 1500);
  };
  
  const handleTimeUp = () => {
    setShowFeedback(true);
    setIsCorrect(false);
    
    if (soundEnabled) {
      playSound('wrong');
    }
    
    setTimeout(() => {
      onAnswer('');
      setSelectedOption(null);
      setShowFeedback(false);
      setIsCorrect(null);
    }, 1500);
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="badge badge-secondary">Quiz</span>
        {timeLimit && (
          <Timer
            initialTime={timeLimit}
            onTimeUp={handleTimeUp}
            isPaused={showFeedback}
            variant="secondary"
          />
        )}
      </div>
      
      <motion.h2
        className="text-xl font-bold text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {question.question}
      </motion.h2>
      
      {question.imageUrl && (
        <motion.img
          src={question.imageUrl}
          alt="Question illustration"
          className="w-full h-48 object-cover mb-6 rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
      )}
      
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            className={`p-4 rounded-lg text-left font-medium transition-all w-full ${
              selectedOption === option
                ? 'bg-secondary-500 text-white'
                : 'bg-white border-2 border-secondary-200 hover:border-secondary-500'
            } ${
              showFeedback && option === question.correctAnswer
                ? 'bg-green-500 text-white border-green-500'
                : showFeedback && selectedOption === option && option !== question.correctAnswer
                ? 'bg-red-500 text-white border-red-500'
                : ''
            }`}
            onClick={() => handleOptionSelect(option)}
            disabled={showFeedback}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
          >
            {option}
          </motion.button>
        ))}
      </div>
      
      {showFeedback && (
        <motion.div
          className={`p-4 rounded-lg text-center font-bold mb-6 ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isCorrect ? 'Correct! 🎉' : `Wrong! The correct answer is ${question.correctAnswer}`}
          {question.explanation && (
            <p className="mt-2 text-sm font-normal">{question.explanation}</p>
          )}
        </motion.div>
      )}
      
      <Button
        onClick={handleSubmit}
        disabled={!selectedOption || showFeedback}
        fullWidth
        variant="secondary"
        size="lg"
      >
        Submit Answer
      </Button>
    </Card>
  );
};

export default QuizQuestion;