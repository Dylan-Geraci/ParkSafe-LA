import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';

/**
 * OfflineBanner component - Shows warning when user is offline
 * @param {Object} props
 * @param {boolean} props.isOnline - Current online status
 * @param {boolean} props.wasOffline - Whether user was offline and is now back online
 */
const OfflineBanner = ({ isOnline, wasOffline }) => {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center
                     bg-gradient-to-r from-amber-500 to-orange-500
                     px-4 py-3 shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-3 text-white">
            <FaExclamationTriangle className="text-xl animate-pulse" />
            <span className="font-medium text-sm sm:text-base">
              You're offline. Check your internet connection.
            </span>
          </div>
        </motion.div>
      )}

      {wasOffline && isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center
                     bg-gradient-to-r from-teal-500 to-cyan-500
                     px-4 py-3 shadow-lg"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 text-white">
            <FaWifi className="text-xl" />
            <span className="font-medium text-sm sm:text-base">
              You're back online!
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
