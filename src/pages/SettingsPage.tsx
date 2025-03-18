import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2, VolumeX, Mic, MicOff, Languages, User } from 'lucide-react';
import { useAppStore } from '../store';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { Language } from '../types';

const SettingsPage: React.FC = () => {
  const {
    user,
    soundEnabled,
    voiceEnabled,
    currentLanguage,
    toggleSound,
    toggleVoice,
    changeLanguage,
    updateUser,
  } = useAppStore();
  
  const [name, setName] = useState(user?.name || '');
  
  if (!user) {
    return (
      <Layout>
        <div className="text-center">
          <p>Please log in to view settings.</p>
        </div>
      </Layout>
    );
  }
  
  const handleUpdateProfile = () => {
    if (name.trim()) {
      updateUser({ name });
    }
  };
  
  const languages: { value: Language; label: string }[] = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'marathi', label: 'Marathi' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'bengali', label: 'Bengali' },
  ];
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-primary-600">
            Settings
          </h1>
          <p className="text-gray-600">
            Customize your learning experience
          </p>
        </motion.div>
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-bold">Profile</h2>
              </div>
              
              <div className="flex flex-col md:flex-row items-center mb-6">
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  size="xl"
                  border
                  borderColor="primary"
                  fallback={user.name.charAt(0)}
                  className="mb-4 md:mb-0 md:mr-6"
                />
                
                <div className="flex-grow">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  
                  <Button
                    onClick={handleUpdateProfile}
                    variant="primary"
                    disabled={!name.trim() || name === user.name}
                  >
                    Update Profile
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <div className="flex items-center mb-6">
                <Settings className="w-6 h-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-bold">Preferences</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {soundEnabled ? (
                      <Volume2 className="w-5 h-5 text-primary-600 mr-2" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-gray-400 mr-2" />
                    )}
                    <span>Sound Effects</span>
                  </div>
                  
                  <Button
                    onClick={toggleSound}
                    variant={soundEnabled ? 'primary' : 'outline'}
                    size="sm"
                  >
                    {soundEnabled ? 'On' : 'Off'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {voiceEnabled ? (
                      <Mic className="w-5 h-5 text-primary-600 mr-2" />
                    ) : (
                      <MicOff className="w-5 h-5 text-gray-400 mr-2" />
                    )}
                    <span>Voice Assistance</span>
                  </div>
                  
                  <Button
                    onClick={toggleVoice}
                    variant={voiceEnabled ? 'primary' : 'outline'}
                    size="sm"
                  >
                    {voiceEnabled ? 'On' : 'Off'}
                  </Button>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Languages className="w-5 h-5 text-primary-600 mr-2" />
                    <span>Language</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <Button
                        key={lang.value}
                        onClick={() => changeLanguage(lang.value)}
                        variant={currentLanguage === lang.value ? 'primary' : 'outline'}
                        size="sm"
                      >
                        {lang.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <h2 className="text-xl font-bold mb-4">About Gyan Guru</h2>
              <p className="text-gray-600 mb-2">
                Gyan Guru is a fun and interactive learning platform designed for Indian children.
              </p>
              <p className="text-gray-600">
                Version 1.0.0 • Made with ❤️ for Indian children
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;