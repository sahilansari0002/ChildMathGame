import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

interface DropZoneProps {
  id: string;
  className?: string;
  children?: React.ReactNode;
  placeholder?: string;
}

const DropZone: React.FC<DropZoneProps> = ({
  id,
  className = '',
  children,
  placeholder = 'Drop your answer here',
}) => {
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`border-2 border-dashed rounded-lg p-4 min-h-[80px] flex items-center justify-center transition-all duration-300 ${
            snapshot.isDraggingOver
              ? 'border-primary-500 bg-primary-50'
              : 'border-primary-200'
          } ${className}`}
        >
          {children || (
            <p className="text-gray-400 text-center">
              {placeholder}
            </p>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DropZone;