import React from 'react';
import { motion } from 'framer-motion';
import { GanttChart as Elephant } from 'lucide-react';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'happy' | 'thinking' | 'excited' | 'sad';
  animate?: boolean;
  className?: string;
  message?: string;
}

const Mascot: React.FC<MascotProps> = ({
  size = 'md',
  expression = 'happy',
  animate = true,
  className = '',
  message,
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };
  
  const expressionColors = {
    happy: 'text-primary-500',
    thinking: 'text-secondary-500',
    excited: 'text-accent-500',
    sad: 'text-gray-500',
  };
  
  const animations = {
    happy: {
      animate: { rotate: [0, 5, 0, -5, 0], y: [0, -5, 0] },
      transition: { repeat: Infinity, duration: 2 },
    },
    thinking: {
      animate: { rotate: [0, 10, 0], scale: [1, 1.05, 1] },
      transition: { repeat: Infinity, duration: 3 },
    },
    excited: {
      animate: { rotate: [0, 10, 0, -10, 0], scale: [1, 1.1, 1, 1.1, 1] },
      transition: { repeat: Infinity, duration: 1 },
    },
    sad: {
      animate: { y: [0, 3, 0], rotate: [0, -3, 0] },
      transition: { repeat: Infinity, duration: 4 },
    },
  };
  
  const currentAnimation = animations[expression];
  
  return (
    <div className={`relative ${className}`}>
      {animate ? (
        <motion.div
          className={`${sizeClasses[size]} ${expressionColors[expression]}`}
          {...currentAnimation}
        >
          <Elephant size="100%" strokeWidth={1.5} />
        </motion.div>
      ) : (
        <div className={`${sizeClasses[size]} ${expressionColors[expression]}`}>
          <Elephant size="100%" strokeWidth={1.5} />
        </div>
      )}
      
      {message && (
        <motion.div
          className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-2 shadow-lg text-sm max-w-[200px] z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="relative">
            <div className="absolute bottom-0 left-0 transform -translate-x-full translate-y-1/2 w-3 h-3 bg-white rotate-45" />
            {message}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Mascot;