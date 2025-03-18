import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Mascot from '../components/ui/Mascot';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <Mascot size="lg" expression="sad" className="mx-auto mb-6" />
            
            <h1 className="text-3xl font-bold mb-2 text-primary-600">
              Oops! Page Not Found
            </h1>
            
            <p className="text-gray-600 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <Button
              onClick={() => navigate('/')}
              variant="primary"
              size="lg"
              fullWidth
              icon={<Home size={18} />}
            >
              Go Back Home
            </Button>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;