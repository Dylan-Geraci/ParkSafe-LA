import React, { useState } from 'react';
import { FaShare, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { generateShareableURL } from '../../utils/urlParams';

/**
 * ShareButton component - Generates and copies shareable URL to clipboard
 * @param {Object} props
 * @param {Object} props.formData - Current form data to encode in URL
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {Function} props.onSuccess - Callback for successful copy
 * @param {Function} props.onError - Callback for copy error
 */
const ShareButton = ({ formData, disabled = false, onSuccess, onError }) => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleShare = async () => {
    if (disabled || !formData) return;

    try {
      const url = generateShareableURL(formData);

      // Try to use Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);

        if (onSuccess) {
          onSuccess('Shareable link copied to clipboard!');
        }

        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback: show URL for manual copy
        if (onError) {
          onError(`Copy this link: ${url}`);
        }
      }
    } catch (err) {
      console.error('Failed to copy URL:', err);

      // Fallback for errors
      const url = generateShareableURL(formData);
      if (onError) {
        onError(`Copy this link: ${url}`);
      }
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleShare}
        disabled={disabled}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-lg
          font-medium transition-all duration-300
          ${
            disabled
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-800/50 backdrop-blur-sm text-white hover:bg-gray-700/70 hover:shadow-lg hover:shadow-teal-500/20'
          }
          border border-gray-700/50
        `}
        whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="text-teal-400"
            >
              <FaCheck />
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <FaShare />
            </motion.div>
          )}
        </AnimatePresence>

        <span className="text-sm">
          {copied ? 'Copied!' : 'Share Link'}
        </span>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && !disabled && !copied && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5
                       bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap
                       pointer-events-none z-50 border border-gray-700"
          >
            Copy shareable link
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2
                            bg-gray-900 border-r border-b border-gray-700 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;
