import React from 'react';
import { FaExclamationCircle, FaRedo } from 'react-icons/fa';

/**
 * ErrorBoundary component - Catches React rendering errors
 * Provides fallback UI and prevents the entire app from crashing
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state to render fallback UI on next render
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // You can also log to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
                        flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl
                          border border-gray-700/50 p-8 text-center shadow-2xl">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-500/10 p-4 rounded-full">
                <FaExclamationCircle className="text-red-500 text-5xl" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-white mb-3">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-400 mb-6">
              We encountered an unexpected error. Don't worry, your data is safe.
              Please try reloading the page.
            </p>

            {/* Reload Button */}
            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 justify-center w-full
                         bg-indigo-500 hover:bg-indigo-600 text-white
                         px-6 py-3 rounded-lg font-medium
                         transition-all duration-300
                         hover:shadow-lg hover:shadow-indigo-500/50"
            >
              <FaRedo />
              Reload Page
            </button>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-gray-400 text-sm cursor-pointer hover:text-gray-300">
                  Error Details (Development Only)
                </summary>
                <div className="mt-3 p-4 bg-gray-900/50 rounded-lg text-xs font-mono
                                text-red-400 overflow-auto max-h-48 border border-gray-700">
                  <p className="font-bold mb-2">{this.state.error.toString()}</p>
                  <pre className="whitespace-pre-wrap text-gray-500">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
