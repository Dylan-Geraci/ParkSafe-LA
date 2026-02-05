import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHistory, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import HistoryItem from './HistoryItem';

/**
 * Search History Component
 * Displays collapsible list of previous searches
 */
const SearchHistory = ({ history, onSelect, onRemove, onClear, shouldReduceMotion }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="mt-6 md:mt-8 glass-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.5 }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FaHistory className="text-blue-500 text-xl" />
          <div className="text-left">
            <h4 className="text-xl font-bold text-slate-50">Search History</h4>
            <p className="text-sm text-slate-400">
              {history.length} {history.length === 1 ? 'search' : 'searches'} saved
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Clear all button */}
          {isExpanded && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Clear all search history?')) {
                  onClear();
                }
              }}
              className="px-3 py-1.5 text-sm bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg border border-red-500/30 transition-colors flex items-center gap-2"
              aria-label="Clear all history"
            >
              <FaTrash className="text-xs" />
              Clear All
            </motion.button>
          )}

          {/* Expand/collapse icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? (
              <FaChevronUp className="text-slate-400" />
            ) : (
              <FaChevronDown className="text-slate-400" />
            )}
          </motion.div>
        </div>
      </button>

      {/* History list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
            className="border-t border-slate-700/50"
          >
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {history.map((item, index) => (
                <HistoryItem
                  key={item.id}
                  item={item}
                  onSelect={onSelect}
                  onRemove={onRemove}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchHistory;
