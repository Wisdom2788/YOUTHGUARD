// Utility functions for checking backend connectivity and handling errors

export const checkBackendConnectivity = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    return response.ok;
  } catch (error) {
    console.warn('Backend connectivity check failed:', error);
    return false;
  }
};

export const isNetworkError = (error: any): boolean => {
  return (
    error.code === 'NETWORK_ERROR' ||
    error.code === 'ECONNREFUSED' ||
    error.message?.includes('Network Error') ||
    error.message?.includes('fetch') ||
    !error.response
  );
};

export const getErrorMessage = (error: any): string => {
  if (isNetworkError(error)) {
    return 'Unable to connect to server. Please check your internet connection and try again.';
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};