import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'error';
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'primary',
  showLabel = false,
  height = 'md',
  className = '',
  animate = true,
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  
  const baseClasses = 'w-full rounded-full overflow-hidden';
  
  const heightClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };
  
  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    accent: 'bg-accent-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
  };
  
  return (
    <div className={className}>
      <div className={`${baseClasses} ${heightClasses[height]} bg-gray-200`}>
        {animate ? (
          <motion.div
            className={`${colorClasses[color]} h-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={`${colorClasses[color]} h-full`}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-gray-600 text-right">
          {value} / {max}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;