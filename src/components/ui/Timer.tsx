import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { formatTime } from '../../utils/helpers';

interface TimerProps {
  initialTime: number;
  onTimeUp?: () => void;
  className?: string;
  isPaused?: boolean;
  showIcon?: boolean;
  variant?: 'primary' | 'secondary' | 'accent' | 'warning' | 'danger';
}

const Timer: React.FC<TimerProps> = ({
  initialTime,
  onTimeUp,
  className = '',
  isPaused = false,
  showIcon = true,
  variant = 'primary',
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  
  const variantClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    accent: 'text-accent-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  };
  
  useEffect(() => {
    if (isPaused) return;
    
    if (timeRemaining <= 0) {
      onTimeUp && onTimeUp();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining, onTimeUp, isPaused]);
  
  // Update color based on time remaining
  const getVariant = () => {
    if (timeRemaining <= initialTime * 0.25) return 'danger';
    if (timeRemaining <= initialTime * 0.5) return 'warning';
    return variant;
  };
  
  const currentVariant = getVariant();
  
  return (
    <div className={`flex items-center ${className}`}>
      {showIcon && (
        <motion.div
          animate={{ scale: timeRemaining <= 10 ? [1, 1.2, 1] : 1 }}
          transition={{ repeat: timeRemaining <= 10 ? Infinity : 0, duration: 1 }}
          className="mr-2"
        >
          <Clock className={`${variantClasses[currentVariant]}`} size={20} />
        </motion.div>
      )}
      <motion.span
        className={`font-bold ${variantClasses[currentVariant]}`}
        animate={{ scale: timeRemaining <= 10 ? [1, 1.1, 1] : 1 }}
        transition={{ repeat: timeRemaining <= 10 ? Infinity : 0, duration: 1 }}
      >
        {formatTime(timeRemaining)}
      </motion.span>
    </div>
  );
};

export default Timer;