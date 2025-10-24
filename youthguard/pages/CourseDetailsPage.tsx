import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, enrollInCourse } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Course } from '../types';

const CourseDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
    const [usingFallbackImage, setUsingFallbackImage] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                const response = await getCourseById(id);
                setCourse(response.data.data);

                setLoading(false);
            } catch (err: any) {
                console.error('Failed to load course:', err);
                setError(err.response?.data?.message || 'Failed to load course details');
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const handleEnrollment = async () => {
        if (!user) {
            navigate('/');
            return;
        }

        if (!id) return;

        try {
            setEnrolling(true);
            setError(null); // Clear any previous errors

            await enrollInCourse(id);
            setEnrollmentSuccess(true);

            // Show success message briefly, then navigate to dashboard
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err: any) {
            console.error('Enrollment failed:', err);

            // Handle authentication errors
            if (err.isAuthError || err.response?.status === 401) {
                setError('Authentication failed. Please log in again.');
                setTimeout(() => {
                    navigate('/');
                }, 1500);
                return;
            }

            // Handle other errors
            const errorMessage = err.response?.data?.message || err.message || 'Failed to enroll in course';
            setError(errorMessage);
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error && !course) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-700">{error}</p>
                <button
                    onClick={() => navigate('/courses')}
                    className="mt-4 btn-primary"
                >
                    Back to Courses
                </button>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-text-primary">Course not found</h2>
                <button
                    onClick={() => navigate('/courses')}
                    className="mt-4 btn-primary"
                >
                    Back to Courses
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate('/courses')}
                className="flex items-center text-primary hover:text-blue-700 mb-4 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Courses
            </button>

            {/* Course Header */}
            <div className="card p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/3 relative">
                        <img
                            src={course.thumbnail || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'}
                            alt={course.title}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                const target = e.target as HTMLImageElement;
                                if (!usingFallbackImage) {
                                    // Cybersecurity-themed fallback image
                                    target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80';
                                    setUsingFallbackImage(true);
                                }
                            }}
                        />
                        {usingFallbackImage && (
                            <div className="absolute bottom-2 left-2">
                                <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                                    Default Image
                                </span>
                            </div>
                        )}
                        {!course.thumbnail && (
                            <div className="absolute bottom-2 left-2">
                                <span className="px-2 py-1 bg-blue-600 bg-opacity-80 text-white text-xs rounded">
                                    Cybersecurity Theme
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="lg:w-2/3">
                        <div className="mb-4">
                            <span className="px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full">
                                {course.category}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold font-heading text-text-primary mb-4">
                            {course.title}
                        </h1>

                        <p className="text-text-secondary mb-6">
                            {course.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <h3 className="font-semibold text-text-primary">Instructor</h3>
                                <p className="text-text-secondary">{course.instructor}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary">Duration</h3>
                                <p className="text-text-secondary">{course.duration} hours</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary">Difficulty</h3>
                                <p className="text-text-secondary">{course.difficulty}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary">Rating</h3>
                                <div className="flex items-center">
                                    <span className="text-text-secondary">{course.rating}</span>
                                    <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enrollment Section */}
            <div className="card p-6">
                <h2 className="text-2xl font-bold font-heading text-text-primary mb-4">
                    Course Enrollment
                </h2>

                {enrollmentSuccess ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-green-700 font-medium">Successfully enrolled in course!</p>
                        </div>
                        <p className="text-green-600 mt-2">Redirecting you to dashboard...</p>
                        <div className="mt-3">
                            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-text-secondary">
                            Join {course.enrollmentCount} other students in this course and start your learning journey today.
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {!user ? (
                            <button
                                onClick={() => navigate('/')}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Login to Enroll
                            </button>
                        ) : (
                            <button
                                onClick={handleEnrollment}
                                disabled={enrolling}
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {enrolling ? (
                                    <>
                                        <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Enrolling...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span>Enroll in Course</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetailsPage;