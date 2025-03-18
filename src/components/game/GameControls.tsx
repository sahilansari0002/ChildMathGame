import React from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, VolumeX, Volume2, Mic, MicOff } from 'lucide-react';
import { useAppStore } from '../../store';
import Button from '../ui/Button';

interface GameControlsProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
  className?: string;
}

const GameControls: React.FC<GameControlsProps> = ({
  isPaused,
  onTogglePause,
  onSkip,
  showSkip = false,
  className = '',
}) => {
  const { soundEnabled, toggleSound, voiceEnabled, toggleVoice } = useAppStore();
  
  return (
    <motion.div
      className={`flex items-center justify-between ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-2">
        <Button
          onClick={toggleSound}
          variant="ghost"
          size="sm"
          icon={soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? 'Sound On' : 'Sound Off'}
        </Button>
        
        <Button
          onClick={toggleVoice}
          variant="ghost"
          size="sm"
          icon={voiceEnabled ? <Mic size={18} /> : <MicOff size={18} />}
          aria-label={voiceEnabled ? 'Disable voice' : 'Enable voice'}
        >
          {voiceEnabled ? 'Voice On' : 'Voice Off'}
        </Button>
      </div>
      
      <div className="flex space-x-2">
        {showSkip && onSkip && (
          <Button
            onClick={onSkip}
            variant="outline"
            size="sm"
          >
            Skip
          </Button>
        )}
        
        <Button
          onClick={onTogglePause}
          variant={isPaused ? 'primary' : 'outline'}
          size="sm"
          icon={isPaused ? <Play size={18} /> : <Pause size={18} />}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
      </div>
    </motion.div>
  );
};

export default GameControls;