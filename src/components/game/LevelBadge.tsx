import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';

interface LevelBadgeProps {
  level: number;
  animate?: boolean;
  className?: string;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  animate = false,
  className = '',
}) => {
  const getVariant = () => {
    if (level < 5) return 'primary';
    if (level < 10) return 'secondary';
    return 'accent';
  };
  
  const getLabel = () => {
    if (level < 3) return 'Beginner';
    if (level < 5) return 'Novice';
    if (level < 8) return 'Intermediate';
    if (level < 12) return 'Advanced';
    if (level < 15) return 'Expert';
    return 'Master';
  };
  
  if (animate) {
    return (
      <motion.div
        className={className}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <Badge variant={getVariant()} size="md">
          Level {level} • {getLabel()}
        </Badge>
      </motion.div>
    );
  }
  
  return (
    <div className={className}>
      <Badge variant={getVariant()} size="md">
        Level {level} • {getLabel()}
      </Badge>
    </div>
  );
};

export default LevelBadge;