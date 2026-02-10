import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { getRiskColorClasses } from '../../utils/formatters';

/**
 * Risk Timeline Chart Component
 * Interactive chart showing risk levels across different hours of the day
 * Users can click bars to auto-fill the form with that time
 */
const RiskTimelineChart = ({ currentResult, onTimeSelect, shouldReduceMotion }) => {
  const [chartData, setChartData] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Generate sample data for all 24 hours
  // In a real implementation, this would come from the API
  useEffect(() => {
    const generateTimelineData = () => {
      const hours = [];
      for (let i = 0; i < 24; i++) {
        // Sample risk pattern: higher at night, lower during day
        let riskValue;
        if (i >= 22 || i <= 4) {
          // Late night/early morning: higher risk (60-85%)
          riskValue = 60 + Math.random() * 25;
        } else if (i >= 5 && i <= 9) {
          // Morning: lower risk (20-40%)
          riskValue = 20 + Math.random() * 20;
        } else if (i >= 10 && i <= 17) {
          // Daytime: medium-low risk (25-45%)
          riskValue = 25 + Math.random() * 20;
        } else {
          // Evening: medium risk (45-65%)
          riskValue = 45 + Math.random() * 20;
        }

        const hour12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
        const amPm = i < 12 ? 'AM' : 'PM';

        hours.push({
          hour24: i,
          hour12,
          amPm,
          label: `${hour12}${amPm}`,
          risk: Math.round(riskValue),
          isCurrentSelection: false,
        });
      }
      return hours;
    };

    const data = generateTimelineData();

    // Mark current selection if exists
    if (currentResult) {
      const currentHour = data.find(
        (d) =>
          d.hour12 === parseInt(currentResult.location.time.split(':')[0].split(' ')[0]) &&
          d.amPm === currentResult.location.time.split(' ')[1]
      );
      if (currentHour) {
        currentHour.isCurrentSelection = true;
      }
    }

    setChartData(data);
  }, [currentResult]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const colorClasses = getRiskColorClasses(data.risk);

      return (
        <div className="glass-card p-3 border border-blue-200">
          <p className="text-slate-900 font-semibold mb-1">{data.label}</p>
          <p className={`text-sm font-bold text-slate-800`}>
            Risk: <span className={colorClasses.badge.split(' ')[1]}>{data.risk}%</span>
          </p>
          <p className="text-xs text-slate-600 mt-1">Click to analyze this time</p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data) => {
    if (onTimeSelect) {
      onTimeSelect({
        hour: data.hour12,
        am_pm: data.amPm,
      });
    }
  };

  // Get color for bar based on risk level
  const getBarColor = (risk, isHovered, isSelected) => {
    const colorClasses = getRiskColorClasses(risk);

    if (isSelected) {
      return '#6366f1'; // Indigo for selected
    }

    if (risk >= 70) {
      return isHovered ? '#dc2626' : '#ef4444'; // Red
    } else if (risk >= 40) {
      return isHovered ? '#f59e0b' : '#fbbf24'; // Amber
    } else {
      return isHovered ? '#059669' : '#10b981'; // Green
    }
  };

  if (chartData.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="mt-6 md:mt-8 glass-card p-8 hover:shadow-glow-indigo transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.5 }}
    >
      <div className="mb-6">
        <h4 className="text-2xl font-bold text-slate-900 mb-2 flex items-center font-heading">
          <svg
            className="w-6 h-6 mr-2 text-slate-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          {currentResult ? `${currentResult.location.zipcode} Risk Timeline` : 'General Risk Timeline'}
        </h4>
        <p className="text-slate-600 text-sm">
          Explore how parking risk varies throughout the day. Click any bar to analyze that time.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          onMouseMove={(state) => {
            if (state && state.activeTooltipIndex !== undefined) {
              setHoveredBar(state.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setHoveredBar(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
          <XAxis
            dataKey="label"
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 11 }}
            interval={1}
          />
          <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Bar
            dataKey="risk"
            radius={[4, 4, 0, 0]}
            onClick={handleBarClick}
            style={{ cursor: 'pointer' }}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.risk, hoveredBar === index, entry.isCurrentSelection)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500"></div>
          <span>Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500"></div>
          <span>Medium Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span>High Risk</span>
        </div>
        {currentResult && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary-500"></div>
            <span>Current Selection</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RiskTimelineChart;
