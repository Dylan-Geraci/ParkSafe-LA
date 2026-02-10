import React, { useState, useCallback } from 'react';
import { FaDownload, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadPDF } from '../../utils/export';

/**
 * ExportButton component - Downloads PDF report of risk analysis
 * @param {Object} props
 * @param {Object} props.enhancedResult - Analysis results to export
 * @param {Object} props.formData - Form data used for analysis
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {Function} props.onSuccess - Callback for successful export
 * @param {Function} props.onError - Callback for export error
 */
const ExportButton = ({ enhancedResult, formData, disabled = false, onSuccess, onError }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleExport = useCallback(async () => {
    if (disabled || !enhancedResult || !formData || isGenerating) return;

    try {
      setIsGenerating(true);

      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Generate and download PDF (synchronous operation)
      downloadPDF(enhancedResult, formData);

      // Wait a moment for download to trigger
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Show success message
      if (onSuccess) {
        onSuccess('PDF report downloaded successfully!');
      }
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      console.error('Enhanced Result:', enhancedResult);
      console.error('Form Data:', formData);

      if (onError) {
        onError(`Failed to generate PDF: ${err.message}`);
      }
    } finally {
      // Always reset loading state
      setIsGenerating(false);
    }
  }, [disabled, enhancedResult, formData, onSuccess, onError]);

  return (
    <div className="relative">
      <motion.button
        onClick={handleExport}
        disabled={disabled || isGenerating}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-lg
          font-medium transition-all duration-300
          ${
            disabled || isGenerating
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-800/50 backdrop-blur-sm text-white hover:bg-gray-700/70 hover:shadow-lg hover:shadow-indigo-500/20'
          }
          border border-gray-700/50
        `}
        whileHover={!disabled && !isGenerating ? { scale: 1.02, y: -1 } : {}}
        whileTap={!disabled && !isGenerating ? { scale: 0.98 } : {}}
      >
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                rotate: {
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
              className="text-indigo-400"
            >
              <FaSpinner />
            </motion.div>
          ) : (
            <motion.div
              key="download"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <FaDownload />
            </motion.div>
          )}
        </AnimatePresence>

        <span className="text-sm">
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </span>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && !disabled && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5
                       bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap
                       pointer-events-none z-50 border border-gray-700"
          >
            Download PDF report
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2
                            bg-gray-900 border-r border-b border-gray-700 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportButton;
