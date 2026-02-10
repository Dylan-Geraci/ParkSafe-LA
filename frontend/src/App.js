import React, { useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Card from './components/ui/Card';
import RiskAssessmentForm from './components/form/RiskAssessmentForm';
import RiskScoreCard from './components/results/RiskScoreCard';
import RiskFactorsCard from './components/results/RiskFactorsCard';
import RecommendationsCard from './components/results/RecommendationsCard';
import RiskTimelineChart from './components/visualizations/RiskTimelineChart';
import SearchHistory from './components/history/SearchHistory';
import ExportButton from './components/results/ExportButton';
import ShareButton from './components/results/ShareButton';
import OfflineBanner from './components/ui/OfflineBanner';
import { ToastContainer, showToast } from './components/ui/Toast';
import { useRiskPrediction } from './hooks/useRiskPrediction';
import { useSearchHistory } from './hooks/useSearchHistory';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { decodeSearchParams } from './utils/urlParams';

function App() {
  const shouldReduceMotion = useReducedMotion();
  const { result, enhancedResult, isLoading, predict } = useRiskPrediction();
  const { history, addToHistory, clearHistory, removeFromHistory } = useSearchHistory();
  const { isOnline, wasOffline } = useNetworkStatus();
  const formRef = useRef(null);
  const lastFormDataRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const handleFormSubmit = async (formData) => {
    // Check if online before submitting
    if (!isOnline) {
      showToast.error('You are offline. Please check your connection.');
      return;
    }

    lastFormDataRef.current = formData;
    await predict(formData);
  };

  // Load form data from URL parameters on mount
  useEffect(() => {
    const urlParams = decodeSearchParams();
    if (urlParams && formRef.current) {
      formRef.current.loadFormData(urlParams);
      // Optionally auto-submit
      // handleFormSubmit(urlParams);
    }
  }, []); // Intentionally empty - only run on mount

  // Save to history when result is received
  useEffect(() => {
    if (enhancedResult && lastFormDataRef.current) {
      addToHistory({
        formData: lastFormDataRef.current,
        result: enhancedResult,
      });
    }
  }, [enhancedResult, addToHistory]);

  // Handle time selection from timeline chart
  const handleTimeSelect = (timeData) => {
    if (formRef.current) {
      formRef.current.updateTime(timeData);
    }
  };

  // Handle selecting a search from history
  const handleHistorySelect = (formData) => {
    if (formRef.current) {
      formRef.current.loadFormData(formData);
    }
  };

  return (
    <div className="min-h-screen professional-bg p-4 md:p-8">
      {/* Offline Banner */}
      <OfflineBanner isOnline={isOnline} wasOffline={wasOffline} />

      {/* Toast Notifications */}
      <ToastContainer />
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-glow-indigo"
      >
        Skip to main content
      </a>

      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isLoading && 'Analyzing parking risk data'}
        {enhancedResult &&
          `Analysis complete. Risk level is ${enhancedResult.riskLevel} at ${enhancedResult.riskPercentage} percent.`}
      </div>

      <div className="max-w-7xl mx-auto" id="main-content">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent font-heading">
            ParkSafe-LA Dashboard
          </h1>
          <h2 className="text-base md:text-lg text-slate-600">
            Parking Risk Analytics for LA County
          </h2>
        </div>

        {/* Dashboard Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Form Card */}
          <Card
            colSpan="lg:col-span-4"
            variants={cardVariants}
            shouldReduceMotion={shouldReduceMotion}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center font-heading">
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Risk Assessment
            </h3>
            <RiskAssessmentForm
              ref={formRef}
              onSubmit={handleFormSubmit}
              isLoading={isLoading || !isOnline}
            />
          </Card>

          {/* Risk Score Card */}
          <Card
            colSpan="lg:col-span-4"
            variants={cardVariants}
            shouldReduceMotion={shouldReduceMotion}
          >
            <RiskScoreCard
              result={enhancedResult}
              isLoading={isLoading}
              shouldReduceMotion={shouldReduceMotion}
            />
          </Card>

          {/* Risk Factors Card */}
          <Card
            colSpan="lg:col-span-4"
            variants={cardVariants}
            shouldReduceMotion={shouldReduceMotion}
          >
            <RiskFactorsCard result={enhancedResult} isLoading={isLoading} shouldReduceMotion={shouldReduceMotion} />
          </Card>
        </motion.div>

        {/* Recommendations Section */}
        {enhancedResult && (
          <RecommendationsCard
            recommendations={enhancedResult.analysis.recommendations}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}

        {/* Export and Share Actions */}
        {enhancedResult && lastFormDataRef.current && (
          <motion.div
            className="mt-6 flex flex-wrap gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.4, delay: shouldReduceMotion ? 0 : 0.3 }}
          >
            <ExportButton
              enhancedResult={enhancedResult}
              formData={lastFormDataRef.current}
              onSuccess={(msg) => showToast.success(msg)}
              onError={(msg) => showToast.error(msg)}
            />
            <ShareButton
              formData={lastFormDataRef.current}
              onSuccess={(msg) => showToast.success(msg)}
              onError={(msg) => showToast.warning(msg)}
            />
          </motion.div>
        )}

        {/* Risk Timeline Chart */}
        <RiskTimelineChart
          currentResult={enhancedResult}
          onTimeSelect={handleTimeSelect}
          shouldReduceMotion={shouldReduceMotion}
        />

        {/* Search History */}
        <SearchHistory
          history={history}
          onSelect={handleHistorySelect}
          onRemove={removeFromHistory}
          onClear={clearHistory}
          shouldReduceMotion={shouldReduceMotion}
        />

        {/* Basic Result Fallback */}
        {result && !enhancedResult && (
          <div
            className={`risk-card ${
              result.includes('High') ? 'high' : result.includes('Medium') ? 'medium' : 'low'
            }`}
          >
            {result}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-6 glass-card border-l-4 border-primary-500">
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Disclaimer:</strong> This tool is for informational
            purposes only and should not be used to plan, encourage, or engage in any illegal
            activities. The risk predictions are based on historical data analysis and should not be
            considered as legal advice or a guarantee of safety.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
