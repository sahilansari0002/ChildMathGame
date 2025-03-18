import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { GuessQuestion as GuessQuestionType } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Timer from '../ui/Timer';
import { speak } from '../../utils/speechUtils';
import { getLanguageCode, playSound } from '../../utils/helpers';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface GuessQuestionProps {
  question: GuessQuestionType;
  onAnswer: (answer: string) => void;
  timeLimit?: number;
}

const GuessQuestion: React.FC<GuessQuestionProps> = ({
  question,
  onAnswer,
  timeLimit,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputAnswer, setInputAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [draggedAnswer, setDraggedAnswer] = useState<string | null>(null);
  
  const { voiceEnabled, currentLanguage, soundEnabled } = useAppStore();
  
  useEffect(() => {
    if (voiceEnabled && question.hint) {
      speak(question.hint, getLanguageCode(currentLanguage));
    }
  }, [question, voiceEnabled, currentLanguage]);
  
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    if (result.destination.droppableId === 'answer-zone') {
      const option = question.options?.[result.source.index] || '';
      setDraggedAnswer(option);
    }
  };
  
  const handleSubmit = () => {
    const answer = selectedOption || inputAnswer || draggedAnswer;
    if (!answer) return;
    
    const correct = question.correctAnswer.toLowerCase() === answer.toLowerCase();
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (soundEnabled) {
      playSound(correct ? 'correct' : 'wrong');
    }
    
    setTimeout(() => {
      onAnswer(answer);
      setSelectedOption(null);
      setInputAnswer('');
      setDraggedAnswer(null);
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
      setDraggedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(null);
    }, 1500);
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="badge badge-accent">Guess</span>
        {timeLimit && (
          <Timer
            initialTime={timeLimit}
            onTimeUp={handleTimeUp}
            isPaused={showFeedback}
            variant="accent"
          />
        )}
      </div>
      
      {question.hint && (
        <motion.h2
          className="text-xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {question.hint}
        </motion.h2>
      )}
      
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <img
          src={question.imageUrl}
          alt="Guess this"
          className="w-full h-56 object-cover rounded-lg shadow-md"
        />
      </motion.div>
      
      {question.options ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="mb-6">
            <Droppable droppableId="options" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex flex-wrap gap-2 p-4 rounded-lg ${
                    snapshot.isDraggingOver ? 'bg-accent-50' : ''
                  }`}
                >
                  {question.options.map((option, index) => (
                    <Draggable key={option} draggableId={option} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`px-4 py-2 rounded-lg font-medium cursor-grab ${
                            snapshot.isDragging
                              ? 'bg-accent-100 shadow-lg'
                              : 'bg-white border-2 border-accent-200'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {option}
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            
            <div className="mt-4">
              <Droppable droppableId="answer-zone">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`border-2 border-dashed rounded-lg p-4 min-h-[60px] flex items-center justify-center transition-all duration-300 ${
                      snapshot.isDraggingOver
                        ? 'border-accent-500 bg-accent-50'
                        : 'border-accent-200'
                    }`}
                  >
                    {draggedAnswer ? (
                      <div className="px-4 py-2 bg-accent-100 rounded-lg font-medium">
                        {draggedAnswer}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center">
                        Drag your answer here
                      </p>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
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
        disabled={(!(selectedOption || inputAnswer || draggedAnswer)) || showFeedback}
        fullWidth
        variant="accent"
        size="lg"
      >
        Submit Answer
      </Button>
    </Card>
  );
};

export default GuessQuestion;