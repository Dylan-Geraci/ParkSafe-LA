import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// API base URL - defaults to proxy for local dev, can be overridden via environment
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

function App() {
  const [formData, setFormData] = useState({
    zipcode: '',
    day_of_week: '',
    hour: '',
    am_pm: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [enhancedResult, setEnhancedResult] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Watch form data changes and update validation state
  useEffect(() => {
    const isValid = formData.zipcode && 
                   formData.zipcode.length === 5 && 
                   /^\d{5}$/.test(formData.zipcode) &&
                   formData.day_of_week &&
                   formData.hour &&
                   formData.hour >= 1 &&
                   formData.hour <= 12 &&
                   formData.am_pm;
    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Handle ZIP code input (numbers only, max 5 digits)
    if (name === 'zipcode') { 
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 5);
    }
    
    // Handle hour input (numbers only, max 2 digits)
    if (name === 'hour') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 2);
      const hourNum = parseInt(processedValue);
      if (hourNum > 12) processedValue = '12';
      if (hourNum === 0) processedValue = '1';
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Only validate ZIP code as user types (when it's complete)
    if (name === 'zipcode') {
      if (processedValue.length === 5) {
        if (!/^\d{5}$/.test(processedValue)) {
          setErrors(prev => ({ ...prev, zipcode: 'Please enter a valid 5-digit ZIP code' }));
        } else {
          setErrors(prev => ({ ...prev, zipcode: undefined }));
        }
      } else if (processedValue.length > 0) {
        // Clear error while typing
        setErrors(prev => ({ ...prev, zipcode: undefined }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields on submit
    const newErrors = {};
    
    if (!formData.zipcode || formData.zipcode.length !== 5 || !/^\d{5}$/.test(formData.zipcode)) {
      newErrors.zipcode = 'Please enter a valid 5-digit ZIP code';
    }
    
    if (!formData.day_of_week) {
      newErrors.day_of_week = 'Please select a day of the week';
    }
    
    if (!formData.hour || formData.hour < 1 || formData.hour > 12) {
      newErrors.hour = 'Please enter a valid hour (1-12)';
    }
    
    if (!formData.am_pm) {
      newErrors.am_pm = 'Please select AM or PM';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    setEnhancedResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Extract both basic and enhanced results
      const { message, enhanced } = response.data;
      setResult(message);

      // Store enhanced data if available
      if (enhanced) {
        setEnhancedResult(enhanced);
      }
    } catch (error) {
      console.error('Error making prediction:', error);
      setResult('Error: Unable to make prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen professional-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-blue-400 via-violet-400 to-blue-500 bg-clip-text text-transparent">
            ParkSafe-LA Dashboard
          </h1>
          <h2 className="text-base md:text-lg text-slate-300">
            Parking Risk Analytics for LA County
          </h2>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

          {/* Form Card - Top Left */}
          <div className="lg:col-span-4 glass-card p-8 hover:shadow-glow-blue transition-all duration-300">
            <h3 className="text-2xl font-bold text-slate-50 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Risk Assessment
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ZIP Code */}
              <div>
                <label htmlFor="zipcode" className="block text-sm font-semibold tracking-wide uppercase text-slate-300 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  placeholder="90210"
                  className={`input-field ${errors.zipcode ? 'error' : formData.zipcode.length === 5 && !errors.zipcode ? 'valid' : ''}`}
                  maxLength={5}
                  aria-label="ZIP Code"
                  aria-invalid={errors.zipcode ? 'true' : 'false'}
                  aria-describedby={errors.zipcode ? 'zipcode-error' : undefined}
                />
                {errors.zipcode && (
                  <p id="zipcode-error" className="text-red-400 text-xs mt-2 flex items-center" role="alert">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.zipcode}
                  </p>
                )}
              </div>

              {/* Day of Week */}
              <div>
                <label htmlFor="day_of_week" className="block text-sm font-semibold tracking-wide uppercase text-slate-300 mb-2">
                  Day
                </label>
                <select
                  id="day_of_week"
                  name="day_of_week"
                  value={formData.day_of_week}
                  onChange={handleInputChange}
                  className={`input-field ${errors.day_of_week ? 'error' : formData.day_of_week ? 'valid' : ''}`}
                  aria-label="Day of Week"
                  aria-invalid={errors.day_of_week ? 'true' : 'false'}
                  aria-describedby={errors.day_of_week ? 'day-error' : undefined}
                >
                  <option value="">Select day</option>
                  {DAYS_OF_WEEK.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                {errors.day_of_week && (
                  <p id="day-error" className="text-red-400 text-xs mt-2 flex items-center" role="alert">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.day_of_week}
                  </p>
                )}
              </div>

              {/* Hour and AM/PM */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hour" className="block text-sm font-semibold tracking-wide uppercase text-slate-300 mb-2">
                    Hour
                  </label>
                  <input
                    type="text"
                    id="hour"
                    name="hour"
                    value={formData.hour}
                    onChange={handleInputChange}
                    placeholder="11"
                    className={`input-field ${errors.hour ? 'error' : formData.hour && formData.hour >= 1 && formData.hour <= 12 ? 'valid' : ''}`}
                    aria-label="Hour"
                    aria-invalid={errors.hour ? 'true' : 'false'}
                    aria-describedby={errors.hour ? 'hour-error' : undefined}
                  />
                  {errors.hour && (
                    <p id="hour-error" className="text-red-400 text-xs mt-2 flex items-center" role="alert">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {errors.hour}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="am_pm" className="block text-sm font-semibold tracking-wide uppercase text-slate-300 mb-2">
                    Period
                  </label>
                  <select
                    id="am_pm"
                    name="am_pm"
                    value={formData.am_pm}
                    onChange={handleInputChange}
                    className={`input-field ${errors.am_pm ? 'error' : formData.am_pm ? 'valid' : ''}`}
                    aria-label="AM or PM"
                    aria-invalid={errors.am_pm ? 'true' : 'false'}
                    aria-describedby={errors.am_pm ? 'ampm-error' : undefined}
                  >
                    <option value="">AM/PM</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                  {errors.am_pm && (
                    <p id="ampm-error" className="text-red-400 text-xs mt-2 flex items-center" role="alert">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {errors.am_pm}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`btn-primary mt-6 flex items-center justify-center space-x-2 ${
                  !isFormValid || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label={isLoading ? 'Analyzing risk' : 'Analyze risk'}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Analyze Risk</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Risk Score Card - Top Center */}
          <div className="lg:col-span-4 glass-card p-8 hover:shadow-glow-blue transition-all duration-300">
            {enhancedResult ? (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-50 mb-6 flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Risk Score
                </h3>
                <div className={`relative w-44 h-44 mx-auto mb-6 rounded-full flex items-center justify-center border-4 ${
                  enhancedResult.riskPercentage >= 70 ? 'bg-gradient-to-br from-red-600 to-red-700 border-red-500/30 shadow-glow-red' :
                  enhancedResult.riskPercentage >= 40 ? 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400/30 shadow-glow-amber' :
                  'bg-gradient-to-br from-emerald-600 to-emerald-700 border-emerald-500/30 shadow-glow-emerald'
                }`}>
                  <div className="text-white text-center">
                    <div className="text-5xl font-extrabold mb-1">{enhancedResult.riskPercentage}%</div>
                    <div className="text-lg font-semibold opacity-90">{enhancedResult.riskLevel}</div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-2">
                  <span className="font-semibold text-slate-200">Confidence:</span> {enhancedResult.confidence}%
                </p>
                <p className="text-slate-400 text-xs">
                  {enhancedResult.location.time} on {enhancedResult.location.day} • ZIP {enhancedResult.location.zipcode}
                </p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-200 font-semibold text-lg">Analyzing Risk...</p>
                <p className="text-slate-400 text-sm mt-2">Processing location and timing data</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-600/50">
                  <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm">Fill out the form to see your risk analysis</p>
              </div>
            )}
          </div>

          {/* Risk Factors Card - Top Right */}
          <div className="lg:col-span-4 glass-card p-8 hover:shadow-glow-blue transition-all duration-300">
            <h3 className="text-2xl font-bold text-slate-50 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Risk Factors
            </h3>
            {enhancedResult ? (
              <div className="space-y-8">
                {/* Location Factor */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-200 flex items-center">
                      <span className="text-2xl mr-2">📍</span>
                      Location (ZIP {enhancedResult.location.zipcode})
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      enhancedResult.analysis.factors.location.percentage >= 70 ? 'bg-red-900/40 text-red-300 border border-red-500/30' :
                      enhancedResult.analysis.factors.location.percentage >= 40 ? 'bg-amber-900/40 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {enhancedResult.analysis.factors.location.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/30">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        enhancedResult.analysis.factors.location.percentage >= 70 ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-glow-red' :
                        enhancedResult.analysis.factors.location.percentage >= 40 ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-glow-amber' :
                        'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-glow-emerald'
                      }`}
                      style={{ width: `${enhancedResult.analysis.factors.location.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Time Factor */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-200 flex items-center">
                      <span className="text-2xl mr-2">🕐</span>
                      Time ({enhancedResult.location.time})
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      enhancedResult.analysis.factors.timing.percentage >= 70 ? 'bg-red-900/40 text-red-300 border border-red-500/30' :
                      enhancedResult.analysis.factors.timing.percentage >= 40 ? 'bg-amber-900/40 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {enhancedResult.analysis.factors.timing.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/30">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        enhancedResult.analysis.factors.timing.percentage >= 70 ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-glow-red' :
                        enhancedResult.analysis.factors.timing.percentage >= 40 ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-glow-amber' :
                        'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-glow-emerald'
                      }`}
                      style={{ width: `${enhancedResult.analysis.factors.timing.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Day Factor */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-200 flex items-center">
                      <span className="text-2xl mr-2">📅</span>
                      Day ({enhancedResult.location.day})
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      enhancedResult.analysis.factors.dayOfWeek.percentage >= 70 ? 'bg-red-900/40 text-red-300 border border-red-500/30' :
                      enhancedResult.analysis.factors.dayOfWeek.percentage >= 40 ? 'bg-amber-900/40 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {enhancedResult.analysis.factors.dayOfWeek.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/30">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        enhancedResult.analysis.factors.dayOfWeek.percentage >= 70 ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-glow-red' :
                        enhancedResult.analysis.factors.dayOfWeek.percentage >= 40 ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-glow-amber' :
                        'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-glow-emerald'
                      }`}
                      style={{ width: `${enhancedResult.analysis.factors.dayOfWeek.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-3 border border-violet-500/30">
                  <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm">Risk breakdown will appear here after analysis</p>
              </div>
            )}
          </div>
        </div>


        {/* Recommendations Section - Bottom Row */}
        {enhancedResult && (
          <div className="mt-6 md:mt-8 glass-card p-8 hover:shadow-glow-blue transition-all duration-300">
            <h4 className="text-2xl font-bold text-slate-50 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
              Recommendations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enhancedResult.analysis.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-amber-900/20 rounded-lg border border-amber-500/30 hover:bg-amber-900/30 hover:border-amber-500/50 transition-all duration-200">
                  <div className="w-7 h-7 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/30">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-200 text-sm font-medium leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Basic Result (fallback) */}
        {result && !enhancedResult && (
          <div className={`risk-card ${result.includes('High') ? 'high' : 'low'}`}>
            {result}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>Disclaimer:</strong> This tool is for informational purposes only and should not be used to plan, encourage, or engage in any illegal activities. The risk predictions are based on historical data analysis and should not be considered as legal advice or a guarantee of safety.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
