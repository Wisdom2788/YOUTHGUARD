import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getJobs } from '../services/api';
import { Job } from '../types';
import JobCard from '../components/JobCard';

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendConnected, setBackendConnected] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getJobs();
        setJobs(response.data.data);
        setBackendConnected(true);
      } catch (error: any) {
        console.error("Failed to fetch jobs", error);
        if (error.isNetworkError || !error.response) {
          setBackendConnected(false);
          setError("Unable to connect to server. Please check your internet connection and try again.");
        } else {
          setError("Failed to load jobs. Please try again later.");
        }
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];

  const filteredJobs = useMemo(() => {
    return jobs
      .filter(job => jobTypeFilter === 'All' || job.jobType === jobTypeFilter)
      .filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [jobs, jobTypeFilter, searchTerm]);

  if (error) {
    return (
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="space-y-6"
      >
        <div className="bg-red-50 border border-red-200 rounded-md p-4 slide-in-right dark:bg-red-900 dark:border-red-700">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
          {!backendConnected && (
            <div className="mt-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 sm:space-y-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-text-primary"
          >
            Job Board
          </motion.h1>
          <motion.p 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-1 sm:mt-2 text-text-secondary text-base sm:text-lg"
          >
            Discover your next career opportunity in the tech industry.
          </motion.p>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-grow">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        <div>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </motion.select>
        </div>
      </motion.div>

      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-64"
        >
          <div className="loading-spinner"></div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4 sm:space-y-6"
        >
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + (index % 2) * 0.1 }}
              className={`bounce-in animation-delay-${(index % 2) * 100}`}
            >
              <JobCard 
                job={job} 
              />
            </motion.div>
          ))}
        </motion.div>
      )}
      { !loading && filteredJobs.length === 0 && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center py-12 sm:py-16"
        >
            <h3 className="text-xl sm:text-2xl font-semibold text-text-primary">No jobs found</h3>
            <p className="text-text-secondary mt-2">Try adjusting your search or filter criteria.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JobsPage;