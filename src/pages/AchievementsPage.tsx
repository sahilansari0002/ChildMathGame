import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Medal } from 'lucide-react';
import { useAppStore } from '../store';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import XpBar from '../components/game/XpBar';
import LevelBadge from '../components/game/LevelBadge';
import Badge from '../components/ui/Badge';

const AchievementsPage: React.FC = () => {
  const { user } = useAppStore();
  
  if (!user) {
    return (
      <Layout>
        <div className="text-center">
          <p>Please log in to view your achievements.</p>
        </div>
      </Layout>
    );
  }
  
  // Sample badges for demonstration
  const allBadges = [
    {
      id: 'math-beginner',
      name: 'Math Beginner',
      description: 'Complete 5 math games',
      icon: '🔢',
      unlocked: user.progress.mathCompleted >= 5,
    },
    {
      id: 'quiz-master',
      name: 'Quiz Master',
      description: 'Score 100 points in quiz games',
      icon: '🧠',
      unlocked: user.progress.quizCompleted >= 3,
    },
    {
      id: 'guess-expert',
      name: 'Guess Expert',
      description: 'Correctly identify 20 images',
      icon: '🔍',
      unlocked: user.progress.guessCompleted >= 2,
    },
    {
      id: 'level-5',
      name: 'Level 5 Achieved',
      description: 'Reach level 5',
      icon: '⭐',
      unlocked: user.level >= 5,
    },
    {
      id: 'perfect-score',
      name: 'Perfect Score',
      description: 'Get 100% on any game',
      icon: '🏆',
      unlocked: false,
    },
    {
      id: 'fast-learner',
      name: 'Fast Learner',
      description: 'Complete a game in under 2 minutes',
      icon: '⚡',
      unlocked: false,
    },
  ];
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-primary-600">
            Your Achievements
          </h1>
          <p className="text-gray-600">
            Track your progress and earn badges!
          </p>
        </motion.div>
        
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
                <h2 className="text-xl font-bold">Your Stats</h2>
              </div>
              <LevelBadge level={user.level} animate />
            </div>
            
            <XpBar className="mb-6" showLevel={false} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Medal className="w-5 h-5 text-primary-600 mr-2" />
                  <h3 className="font-semibold">Math Games</h3>
                </div>
                <p className="text-2xl font-bold text-primary-600">{user.progress.mathCompleted}</p>
                <p className="text-sm text-gray-600">Games completed</p>
              </div>
              
              <div className="bg-secondary-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Medal className="w-5 h-5 text-secondary-600 mr-2" />
                  <h3 className="font-semibold">Quiz Games</h3>
                </div>
                <p className="text-2xl font-bold text-secondary-600">{user.progress.quizCompleted}</p>
                <p className="text-sm text-gray-600">Games completed</p>
              </div>
              
              <div className="bg-accent-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Medal className="w-5 h-5 text-accent-600 mr-2" />
                  <h3 className="font-semibold">Guess Games</h3>
                </div>
                <p className="text-2xl font-bold text-accent-600">{user.progress.guessCompleted}</p>
                <p className="text-sm text-gray-600">Games completed</p>
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
            <div className="flex items-center mb-6">
              <Award className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-bold">Badges</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  className={`p-4 rounded-lg border-2 ${
                    badge.unlocked
                      ? 'border-primary-200 bg-white'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{badge.icon}</span>
                    <div>
                      <h3 className="font-bold">{badge.name}</h3>
                      <div className="flex items-center">
                        <Badge
                          variant={badge.unlocked ? 'success' : 'primary'}
                          size="sm"
                        >
                          {badge.unlocked ? 'Unlocked' : 'Locked'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AchievementsPage;