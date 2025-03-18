import React from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface DraggableAnswerProps {
  options: string[];
  onDragEnd: (result: DropResult) => void;
  className?: string;
}

const DraggableAnswer: React.FC<DraggableAnswerProps> = ({
  options,
  onDragEnd,
  className = '',
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={className}>
        <Droppable droppableId="options" direction="horizontal">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`flex flex-wrap gap-2 p-4 rounded-lg ${
                snapshot.isDraggingOver ? 'bg-primary-50' : ''
              }`}
            >
              {options.map((option, index) => (
                <Draggable key={option} draggableId={option} index={index}>
                  {(provided, snapshot) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`px-4 py-2 rounded-lg font-medium cursor-grab ${
                        snapshot.isDragging
                          ? 'bg-primary-100 shadow-lg'
                          : 'bg-white border-2 border-primary-200'
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
      </div>
    </DragDropContext>
  );
};

export default DraggableAnswer;