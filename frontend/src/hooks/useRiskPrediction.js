import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { showToast } from '../components/ui/Toast';

/**
 * Custom hook for risk prediction API interaction
 * @returns {Object} { result, enhancedResult, isLoading, error, predict, resetResults }
 */
export const useRiskPrediction = () => {
  const [result, setResult] = useState(null);
  const [enhancedResult, setEnhancedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Makes a prediction request to the API
   * @param {Object} formData - Form data with zipcode, day_of_week, hour, am_pm
   * @returns {Promise<Object>} Returns the enhanced result or null
   */
  const predict = async (formData) => {
    setIsLoading(true);
    setResult(null);
    setEnhancedResult(null);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      // Extract both basic and enhanced results
      const { message, enhanced } = response.data;
      setResult(message);

      // Store enhanced data if available
      if (enhanced) {
        setEnhancedResult(enhanced);
        showToast.success('Risk analysis completed successfully!');
        return enhanced;
      }

      return null;
    } catch (err) {
      console.error('Error making prediction:', err);

      // Determine specific error message based on error type
      let errorMessage = 'Unable to make prediction. Please try again.';

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = 'Request timed out. The server is taking too long to respond. Please try again.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Service not found. The API endpoint may be unavailable.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again in a few moments.';
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.error || 'Invalid request. Please check your input.';
      } else if (!navigator.onLine) {
        errorMessage = 'You appear to be offline. Check your internet connection.';
      } else if (err.message === 'Network Error') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      setResult(errorMessage);
      setError(errorMessage);

      // Show error toast with retry option
      showToast.error(errorMessage, {
        retry: () => predict(formData),
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resets all results and error state
   */
  const resetResults = () => {
    setResult(null);
    setEnhancedResult(null);
    setError(null);
  };

  return {
    result,
    enhancedResult,
    isLoading,
    error,
    predict,
    resetResults,
  };
};
