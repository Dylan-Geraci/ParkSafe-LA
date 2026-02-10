import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaCalendarDay, FaTrash } from 'react-icons/fa';
import { getRiskColorClasses } from '../../utils/formatters';

/**
 * Individual history item component
 */
const HistoryItem = ({ item, onSelect, onRemove, shouldReduceMotion }) => {
  const { formData, result, timestamp } = item;
  const colorClasses = getRiskColorClasses(result.riskPercentage);

  // Format timestamp
  const date = new Date(timestamp);
  const timeAgo = getTimeAgo(date);

  return (
    <motion.div
      className="glass-card p-4 hover:shadow-glow-indigo transition-all duration-200 cursor-pointer group"
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.01 }}
      onClick={() => onSelect(formData)}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Risk badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-bold ${colorClasses.badge}`}>
              {result.riskPercentage}% {result.riskLevel}
            </span>
            <span className="text-xs text-slate-500">{timeAgo}</span>
          </div>

          {/* Details */}
          <div className="space-y-1 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-slate-500 flex-shrink-0" />
              <span className="truncate">ZIP {formData.zipcode}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarDay className="text-slate-500 flex-shrink-0" />
              <span className="truncate">{formData.day_of_week}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-slate-500 flex-shrink-0" />
              <span className="truncate">
                {formData.hour}:00 {formData.am_pm}
              </span>
            </div>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
          aria-label="Remove from history"
        >
          <FaTrash className="text-red-500 text-sm" />
        </button>
      </div>
    </motion.div>
  );
};

/**
 * Get human-readable time ago string
 */
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default HistoryItem;
