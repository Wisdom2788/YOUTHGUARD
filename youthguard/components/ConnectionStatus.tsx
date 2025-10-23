import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
            isOnline 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white' : 'bg-white animate-pulse'}`} />
            <span className="text-sm font-medium">
              {isOnline ? 'Back online' : 'No internet connection'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectionStatus;