import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="bg-white py-4 px-4 shadow-inner mt-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="container mx-auto flex flex-col items-center justify-center text-sm text-gray-500">
        <div className="flex items-center mb-2">
          <span>Made with</span>
          <Heart size={16} className="mx-1 text-red-500 fill-current" />
          <span>for Indian children</span>
        </div>
        <p>© 2025 Gyan Guru - Fun Math & Quiz Game</p>
      </div>
    </motion.footer>
  );
};

export default Footer;