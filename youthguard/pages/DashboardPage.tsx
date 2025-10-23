import React, { useEffect, useState } from 'react';
import { motion, Transition } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import { BookIcon, BriefcaseIcon, MessageIcon } from '../components/icons';
import CourseCard from '../components/CourseCard';
import JobCard from '../components/JobCard';
import { getCourses, getJobs, getUnreadMessages } from '../services/api';
import { Course, Job } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendConnected, setBackendConnected] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setBackendConnected(true);
        
        let hasNetworkError = false;
        
        // Fetch courses
        try {
          const coursesResponse = await getCourses();
          setCourses(coursesResponse.data.data.slice(0, 2));
        } catch (err: any) {
          console.error('Failed to fetch courses:', err);
          if (err.isNetworkError || !err.response) {
            hasNetworkError = true;
          }
          setCourses([]);
        }
        
        // Fetch jobs
        try {
          const jobsResponse = await getJobs();
          setJobs(jobsResponse.data.data.slice(0, 2));
        } catch (err: any) {
          console.error('Failed to fetch jobs:', err);
          if (err.isNetworkError || !err.response) {
            hasNetworkError = true;
          }
          setJobs([]);
        }
        
        // Fetch unread messages count
        try {
          if (user?._id) {
            const messagesResponse = await getUnreadMessages(user._id);
            setUnreadMessages(messagesResponse.data.data.length);
          }
        } catch (err: any) {
          console.error('Failed to fetch messages:', err);
          if (err.isNetworkError || !err.response) {
            hasNetworkError = true;
          }
          setUnreadMessages(0);
        }
        
        if (hasNetworkError) {
          setBackendConnected(false);
          setError('Unable to connect to server. Please check your internet connection and try again.');
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data. Please try again.');
        setBackendConnected(false);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const handleRetry = () => {
    window.location.reload();
  };

  if (error && !backendConnected) {
    return (
      <motion.div 
        className="space-y-6 sm:space-y-8 fade-in"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section with Error */}
        <motion.div 
          className="card p-4 sm:p-6 rounded-xl bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border border-red-200 dark:border-red-700"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-red-800 dark:text-red-200 mb-2">
              Connection Error
            </h1>
            <p className="text-red-700 dark:text-red-300 text-base sm:text-lg mb-6">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleRetry}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.href = '/#/'}
                className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Go to Home
              </button>
            </div>
          </div>
        </motion.div>

        {/* Troubleshooting Tips */}
        <motion.div 
          className="card p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold font-heading text-text-primary dark:text-white mb-4">
            Troubleshooting Tips
          </h2>
          <ul className="space-y-2 text-text-secondary dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              Check your internet connection
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              Make sure the backend server is running
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              Try refreshing the page
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              Contact support if the problem persists
            </li>
          </ul>
        </motion.div>
      </motion.div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 sm:space-y-8"
    >
      {/* Hero Section */}
      <motion.div 
        variants={itemVariants}
        className="card p-4 sm:p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:pr-8">
            <motion.h1 
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-text-primary dark:text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Welcome back {user?.firstName}
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="mt-2 text-text-secondary text-base sm:text-lg dark:text-gray-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Continue your journey to success with our latest courses and job opportunities.
            </motion.p>
          </div>
          
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        variants={itemVariants}
      >
        <motion.h2 
          className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-4 sm:mb-6 dark:text-green"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Progress Overview
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="bounce-in dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <StatCard 
              icon={<BookIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
              title="Courses Enrolled"
              value={5}
              caption="2 courses in progress"
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="bounce-in animation-delay-100 dark:bg-gray-800 rounded-xl shadow-full"
          >
            <StatCard 
              icon={<BriefcaseIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
              title="Jobs Applied"
              value={3}
              caption="1 new interview request"
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="bounce-in animation-delay-200 dark:bg-gray-800 rounded-xl shadow-full"
          >
            <StatCard 
              icon={<MessageIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
              title="Unread Messages"
              value={unreadMessages}
              caption="From mentors and peers"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        variants={itemVariants}
        className="slide-up"
      >
        <motion.h2 
          className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-4 sm:mb-6 dark:text-green"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Continue Where You Left Off
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.01 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className={`bounce-in animation-delay-${(index + 1) * 100}`}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        className="slide-up"
      >
        <motion.h2 
          className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-4 sm:mb-6 dark:text-green"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Recommended Job Openings
        </motion.h2>
        <motion.div 
          className="space-y-4 sm:space-y-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
            {jobs.map((job, index) => (
              <motion.div
                key={job._id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.01 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className={`bounce-in animation-delay-${(index + 1) * 100}`}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;