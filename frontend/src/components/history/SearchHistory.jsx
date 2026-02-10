import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import { ParkingTicketIcon } from '../ui/ParkingIcons';
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
        className="w-full p-6 flex items-center justify-between hover:bg-blue-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ParkingTicketIcon className="text-primary-600 w-6 h-6" />
          <div className="text-left">
            <h4 className="text-xl font-bold text-slate-900 font-heading">Search History</h4>
            <p className="text-sm text-slate-600">
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
              className="px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-colors flex items-center gap-2"
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
              <FaChevronUp className="text-slate-600" />
            ) : (
              <FaChevronDown className="text-slate-600" />
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
            className="border-t border-blue-200"
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
