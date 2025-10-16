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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch courses
        try {
          const coursesResponse = await getCourses();
          setCourses(coursesResponse.data.data.slice(0, 2));
        } catch (err) {
          console.error('Failed to fetch courses:', err);
          // Set mock data if API fails
          setCourses([
            {
              _id: '1',
              title: 'Web Development Fundamentals',
              description: 'Learn the basics of HTML, CSS, and JavaScript',
              category: 'Programming',
              instructor: 'John Doe',
              duration: 20,
              difficulty: 'Beginner',
              thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
              enrollmentCount: 120,
              rating: 4.5,
              isActive: true,
              createdBy: '1',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              _id: '2',
              title: 'UI/UX Design Principles',
              description: 'Master the art of user interface and experience design',
              category: 'Design',
              instructor: 'Jane Smith',
              duration: 15,
              difficulty: 'Intermediate',
              thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
              enrollmentCount: 85,
              rating: 4.8,
              isActive: true,
              createdBy: '2',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]);
        }
        
        // Fetch jobs
        try {
          const jobsResponse = await getJobs();
          setJobs(jobsResponse.data.data.slice(0, 2));
        } catch (err) {
          console.error('Failed to fetch jobs:', err);
          // Set mock data if API fails
          setJobs([
            {
              _id: '1',
              title: 'Frontend Developer',
              description: 'We are looking for a skilled frontend developer with React experience',
              company: 'Tech Solutions Inc.',
              location: 'San Francisco, CA',
              jobType: 'Full-time',
              salaryMin: 70000,
              salaryMax: 90000,
              requirements: ['React', 'JavaScript', 'CSS'],
              skills: ['React', 'JavaScript', 'HTML', 'CSS'],
              applicationDeadline: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
              isActive: true,
              postedBy: '1',
              applicationsCount: 12,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              _id: '2',
              title: 'UX Designer',
              description: 'Join our design team to create beautiful user experiences',
              company: 'Creative Studios',
              location: 'New York, NY',
              jobType: 'Full-time',
              salaryMin: 65000,
              salaryMax: 85000,
              requirements: ['Figma', 'Adobe XD', 'User Research'],
              skills: ['UI Design', 'UX Research', 'Prototyping'],
              applicationDeadline: new Date(Date.now() + 45*24*60*60*1000).toISOString(),
              isActive: true,
              postedBy: '2',
              applicationsCount: 8,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]);
        }
        
        // Fetch unread messages count
        try {
          if (user?._id) {
            const messagesResponse = await getUnreadMessages(user._id);
            setUnreadMessages(messagesResponse.data.data.length);
          }
        } catch (err) {
          console.error('Failed to fetch messages:', err);
          // Set mock data if API fails
          setUnreadMessages(3);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
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

  if (error) {
    return (
      <motion.div 
        className="bg-red-50 border border-red-200 rounded-md p-4 slide-in-right"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm text-red-700">{error}</p>
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
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
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
          <motion.div 
            variants={itemVariants}
            className="md:w-1/2 mt-6 md:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-700 dark:to-gray-800 border-2 border-dashed border-blue-300 dark:border-gray-600 rounded-xl w-full h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        variants={itemVariants}
      >
        <motion.h2 
          className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-4 sm:mb-6 dark:text-white"
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
            className="bounce-in"
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
            className="bounce-in animation-delay-100"
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
            className="bounce-in animation-delay-200"
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
          className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-4 sm:mb-6 dark:text-white"
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
          className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-4 sm:mb-6 dark:text-white"
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