import React from 'react';
import { motion } from 'framer-motion';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  border?: boolean;
  borderColor?: 'primary' | 'secondary' | 'accent';
  animate?: boolean;
  fallback?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className = '',
  border = false,
  borderColor = 'primary',
  animate = false,
  fallback,
}) => {
  const baseClasses = 'rounded-full overflow-hidden flex items-center justify-center text-white font-bold';
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg',
  };
  
  const borderClasses = border ? {
    primary: 'border-4 border-primary-500',
    secondary: 'border-4 border-secondary-500',
    accent: 'border-4 border-accent-500',
  }[borderColor] : '';
  
  const fallbackColors = [
    'bg-primary-500',
    'bg-secondary-500',
    'bg-accent-500',
    'bg-green-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-blue-500',
  ];
  
  const fallbackColor = fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
  
  const getFallbackText = () => {
    if (fallback) return fallback;
    if (!alt) return '?';
    return alt.charAt(0).toUpperCase();
  };
  
  const AvatarContent = () => (
    src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <div className={`w-full h-full ${fallbackColor} flex items-center justify-center`}>
        {getFallbackText()}
      </div>
    )
  );
  
  if (animate) {
    return (
      <motion.div
        className={`${baseClasses} ${sizeClasses[size]} ${borderClasses} ${className}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <AvatarContent />
      </motion.div>
    );
  }
  
  return (
    <div className={`${baseClasses} ${sizeClasses[size]} ${borderClasses} ${className}`}>
      <AvatarContent />
    </div>
  );
};

export default Avatar;