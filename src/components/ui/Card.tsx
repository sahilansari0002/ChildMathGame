import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  animate?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
  animate = false,
}) => {
  const baseClasses = 'bg-white rounded-2xl shadow-lg p-6';
  const hoverClasses = hover ? 'cursor-pointer transition-all duration-300 hover:shadow-xl' : '';
  
  if (animate) {
    return (
      <motion.div
        className={`${baseClasses} ${hoverClasses} ${className}`}
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={hover ? { scale: 1.03 } : {}}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;