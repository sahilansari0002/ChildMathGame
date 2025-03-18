import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { MathQuestion as MathQuestionType } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Timer from '../ui/Timer';
import { speak } from '../../utils/speechUtils';
import { getLanguageCode, playSound } from '../../utils/helpers';

interface MathQuestionProps {
  question: MathQuestionType;
  onAnswer: (answer: string | number) => void;
  timeLimit?: number;
}

const MathQuestion: React.FC<MathQuestionProps> = ({
  question,
  onAnswer,
  timeLimit,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputAnswer, setInputAnswer] = useState<string>('');
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
    const answer = selectedOption || inputAnswer;
    const correct = String(question.correctAnswer) === answer;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (soundEnabled) {
      playSound(correct ? 'correct' : 'wrong');
    }
    
    setTimeout(() => {
      onAnswer(answer);
      setSelectedOption(null);
      setInputAnswer('');
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
      setInputAnswer('');
      setShowFeedback(false);
      setIsCorrect(null);
    }, 1500);
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="badge badge-primary">Math</span>
        {timeLimit && (
          <Timer
            initialTime={timeLimit}
            onTimeUp={handleTimeUp}
            isPaused={showFeedback}
          />
        )}
      </div>
      
      <motion.h2
        className="text-2xl font-bold text-center mb-6"
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
          className="w-full h-40 object-contain mb-6 rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
      )}
      
      {question.options ? (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              className={`p-4 rounded-lg text-center font-bold transition-all ${
                selectedOption === option
                  ? 'bg-primary-500 text-white'
                  : 'bg-white border-2 border-primary-200 hover:border-primary-500'
              } ${
                showFeedback && option === String(question.correctAnswer)
                  ? 'bg-green-500 text-white border-green-500'
                  : showFeedback && selectedOption === option && option !== String(question.correctAnswer)
                  ? 'bg-red-500 text-white border-red-500'
                  : ''
              }`}
              onClick={() => handleOptionSelect(option)}
              disabled={showFeedback}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              whileHover={!showFeedback ? { scale: 1.05 } : {}}
              whileTap={!showFeedback ? { scale: 0.95 } : {}}
            >
              {option}
            </motion.button>
          ))}
        </div>
      ) : (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <input
            type="text"
            value={inputAnswer}
            onChange={(e) => setInputAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="input w-full"
            disabled={showFeedback}
          />
        </motion.div>
      )}
      
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
        </motion.div>
      )}
      
      <Button
        onClick={handleSubmit}
        disabled={(!selectedOption && !inputAnswer) || showFeedback}
        fullWidth
        variant="primary"
        size="lg"
      >
        Submit Answer
      </Button>
    </Card>
  );
};

export default MathQuestion;