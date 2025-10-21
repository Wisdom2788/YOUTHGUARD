import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {

  // Animation variants
  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  return (
    <motion.header 
      className="header-mobile-only bg-white shadow-md sticky top-0 z-50 transition-all duration-300 hover:shadow-lg dark:bg-gray-800"
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Header - Only visible on mobile screens */}
        <div className="flex justify-between items-center h-16">
          {/* YouthGuard Logo - Left side */}
          <div className="flex items-center">
            <NavLink 
              to="/dashboard" 
              className="flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105"
            >
              <motion.svg 
                className="h-6 w-6 text-primary" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
              </motion.svg>
              <motion.span 
                className="font-heading font-bold text-lg text-text-primary dark:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                YouthGuard
              </motion.span>
            </NavLink>
          </div>
          
          {/* Hamburger Menu - Right side */}
          {toggleSidebar && (
            <motion.button 
              className="text-text-secondary hover:text-primary focus:outline-none dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
              onClick={toggleSidebar}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle sidebar menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;