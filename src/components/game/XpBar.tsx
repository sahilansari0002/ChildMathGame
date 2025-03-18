import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useAppStore } from '../../store';
import ProgressBar from '../ui/ProgressBar';
import { levelProgress, xpForNextLevel, calculateLevel } from '../../utils/helpers';

interface XpBarProps {
  className?: string;
  showLevel?: boolean;
  animate?: boolean;
}

const XpBar: React.FC<XpBarProps> = ({
  className = '',
  showLevel = true,
  animate = true,
}) => {
  const { user } = useAppStore();
  
  if (!user) return null;
  
  const { xp, level } = user;
  const progress = levelProgress(xp);
  const nextLevelXp = xpForNextLevel(level);
  const currentLevelXp = xpForNextLevel(level - 1);
  const xpInCurrentLevel = xp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-1">
        {showLevel && (
          <div className="flex items-center">
            <Star className="w-4 h-4 text-accent-500 mr-1" />
            <span className="text-sm font-medium text-gray-600">Level {level}</span>
          </div>
        )}
        <div className="text-xs text-gray-500">
          {xpInCurrentLevel} / {xpNeededForNextLevel} XP
        </div>
      </div>
      
      <ProgressBar
        value={progress}
        max={100}
        color="accent"
        height="sm"
        animate={animate}
      />
    </div>
  );
};

export default XpBar;