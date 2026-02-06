import { useState, useEffect } from 'react';

/**
 * Custom hook to track online/offline network status
 * @returns {Object} Object containing isOnline and wasOffline states
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Handler for when connection is restored
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);

      // Clear the "was offline" flag after showing success message
      const timeout = setTimeout(() => {
        setWasOffline(false);
      }, 3000);

      return () => clearTimeout(timeout);
    };

    // Handler for when connection is lost
    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
};

export default useNetworkStatus;
