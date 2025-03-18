import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Award, Settings, VolumeX, Volume2 } from 'lucide-react';
import { useAppStore } from '../../store';
import Mascot from '../ui/Mascot';
import Avatar from '../ui/Avatar';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, soundEnabled, toggleSound } = useAppStore();
  
  return (
    <motion.header
      className="bg-white shadow-md py-3 px-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Mascot size="sm" expression="happy" />
          <span className="font-bold text-xl text-primary-600 font-baloo">Gyan Guru</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSound}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {soundEnabled ? (
              <Volume2 size={20} className="text-primary-500" />
            ) : (
              <VolumeX size={20} className="text-gray-400" />
            )}
          </button>
          
          <Link
            to="/"
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              location.pathname === '/' ? 'bg-primary-100 text-primary-600' : 'text-gray-500'
            }`}
          >
            <Home size={20} />
          </Link>
          
          <Link
            to="/achievements"
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              location.pathname === '/achievements' ? 'bg-primary-100 text-primary-600' : 'text-gray-500'
            }`}
          >
            <Award size={20} />
          </Link>
          
          <Link
            to="/settings"
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              location.pathname === '/settings' ? 'bg-primary-100 text-primary-600' : 'text-gray-500'
            }`}
          >
            <Settings size={20} />
          </Link>
          
          {user && (
            <Link to="/profile">
              <Avatar
                src={user.avatar}
                alt={user.name}
                size="sm"
                border
                borderColor="primary"
                fallback={user.name.charAt(0)}
              />
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;