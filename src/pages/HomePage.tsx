import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calculator, Brain, Image, Trophy, Star } from 'lucide-react';
import { useAppStore } from '../store';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Mascot from '../components/ui/Mascot';
import XpBar from '../components/game/XpBar';
import LevelBadge from '../components/game/LevelBadge';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, initializeUser } = useAppStore();
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(!isAuthenticated);
  
  const handleStartGame = (type: 'math' | 'quiz' | 'guess') => {
    navigate(`/game/${type}`);
  };
  
  const handleSubmitName = () => {
    if (name.trim()) {
      initializeUser(name, '');
      setShowNameInput(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {showNameInput ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center p-8">
              <Mascot size="lg" expression="happy" className="mx-auto mb-6" />
              
              <h1 className="text-3xl font-bold mb-4 text-primary-600">
                Welcome to Gyan Guru!
              </h1>
              
              <p className="text-gray-600 mb-6">
                The fun way to learn math and general knowledge!
              </p>
              
              <div className="max-w-sm mx-auto">
                <div className="mb-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="input w-full"
                  />
                </div>
                
                <Button
                  onClick={handleSubmitName}
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!name.trim()}
                >
                  Let's Start Learning!
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-2 text-primary-600">
                {user ? `Namaste, ${user.name}!` : 'Namaste!'}
              </h1>
              <p className="text-gray-600">
                What would you like to learn today?
              </p>
            </motion.div>
            
            {user && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Trophy className="w-6 h-6 text-accent-500 mr-2" />
                      <h2 className="text-xl font-bold">Your Progress</h2>
                    </div>
                    <LevelBadge level={user.level} animate />
                  </div>
                  
                  <XpBar className="mb-4" />
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-primary-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-1">Math Games</p>
                      <p className="text-xl font-bold text-primary-600">{user.progress.mathCompleted}</p>
                    </div>
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-1">Quiz Games</p>
                      <p className="text-xl font-bold text-secondary-600">{user.progress.quizCompleted}</p>
                    </div>
                    <div className="bg-accent-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-1">Guess Games</p>
                      <p className="text-xl font-bold text-accent-600">{user.progress.guessCompleted}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card
                  className="h-full flex flex-col"
                  hover
                  animate
                >
                  <div className="flex-grow">
                    <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <Calculator className="w-8 h-8 text-primary-600" />
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2 text-primary-600">Math Puzzles</h2>
                    
                    <p className="text-gray-600 mb-4">
                      Fun math games with addition, subtraction, multiplication, and more!
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handleStartGame('math')}
                    variant="primary"
                    fullWidth
                  >
                    Start Math Game
                  </Button>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card
                  className="h-full flex flex-col"
                  hover
                  animate
                >
                  <div className="flex-grow">
                    <div className="bg-secondary-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <Brain className="w-8 h-8 text-secondary-600" />
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2 text-secondary-600">Knowledge Quiz</h2>
                    
                    <p className="text-gray-600 mb-4">
                      Test your knowledge about India, science, history, and more!
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handleStartGame('quiz')}
                    variant="secondary"
                    fullWidth
                  >
                    Start Quiz Game
                  </Button>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card
                  className="h-full flex flex-col"
                  hover
                  animate
                >
                  <div className="flex-grow">
                    <div className="bg-accent-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <Image className="w-8 h-8 text-accent-600" />
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2 text-accent-600">Guess the Image</h2>
                    
                    <p className="text-gray-600 mb-4">
                      Can you identify Indian monuments, animals, fruits, and festivals?
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handleStartGame('guess')}
                    variant="accent"
                    fullWidth
                  >
                    Start Guess Game
                  </Button>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;