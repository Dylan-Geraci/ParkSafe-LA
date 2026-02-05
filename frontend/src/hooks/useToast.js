import { showToast } from '../components/ui/Toast';

/**
 * Custom hook for toast notifications
 * @returns {Object} Toast utility functions
 */
export const useToast = () => {
  return {
    success: showToast.success,
    error: showToast.error,
    warning: showToast.warning,
    loading: showToast.loading,
    dismiss: showToast.dismiss,
  };
};
