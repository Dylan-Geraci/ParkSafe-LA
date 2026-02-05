import { useState, useEffect } from 'react';

const STORAGE_KEY = 'parksafe_search_history';
const MAX_HISTORY_ITEMS = 10;

/**
 * Custom hook for managing search history in localStorage
 * @returns {Object} { history, addToHistory, clearHistory, removeFromHistory }
 */
export const useSearchHistory = () => {
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  /**
   * Adds a search to history
   * @param {Object} search - Search data with formData and result
   */
  const addToHistory = (search) => {
    try {
      const newItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        formData: search.formData,
        result: search.result,
      };

      setHistory((prev) => {
        // Remove duplicates based on form data
        const filtered = prev.filter(
          (item) =>
            !(
              item.formData.zipcode === search.formData.zipcode &&
              item.formData.day_of_week === search.formData.day_of_week &&
              item.formData.hour === search.formData.hour &&
              item.formData.am_pm === search.formData.am_pm
            )
        );

        // Add new item to start and limit to MAX_HISTORY_ITEMS
        const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        return updated;
      });
    } catch (error) {
      console.error('Error adding to search history:', error);
    }
  };

  /**
   * Removes a specific item from history
   * @param {number} id - Item ID to remove
   */
  const removeFromHistory = (id) => {
    try {
      setHistory((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Error removing from search history:', error);
    }
  };

  /**
   * Clears all search history
   */
  const clearHistory = () => {
    try {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
};
