import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

/**
 * Custom toast notification wrapper with glass morphism styling
 */
export const ToastContainer = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(12px)',
          color: '#f1f5f9',
          border: '1px solid rgba(100, 116, 139, 0.3)',
          borderRadius: '0.75rem',
          padding: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        },
        // Success toast
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
          },
        },
        // Error toast
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
          },
        },
        // Loading toast
        loading: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

/**
 * Toast utility functions
 */
export const showToast = {
  success: (message) => {
    toast.success(message);
  },

  error: (message, options = {}) => {
    const { retry } = options;

    if (retry) {
      toast.error(
        (t) => (
          <div className="flex items-center justify-between gap-4">
            <span>{message}</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                retry();
              }}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        ),
        { duration: 6000 }
      );
    } else {
      toast.error(message);
    }
  },

  warning: (message) => {
    toast(message, {
      icon: '⚠️',
      style: {
        border: '1px solid rgba(245, 158, 11, 0.3)',
        boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)',
      },
    });
  },

  loading: (message) => {
    return toast.loading(message);
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
};

export default ToastContainer;
