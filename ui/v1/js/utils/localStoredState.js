import { useState, useEffect } from 'react';

/**
 * Create a new React state and subscribed to localStorage updates
 *
 * @param {string} itemKey
 * @param {string} initialValue
 * @returns {[string, React.Dispatch<React.SetStateAction<string>>]}
 */
export const useLocalStoredState = (itemKey, initialValue = '') => {
  const [value, setValue] = useState(localStorage.getItem(itemKey) || initialValue);

  useEffect(() => {
    localStorage.setItem(itemKey, value);
  }, [value]);

  return [value, setValue];
};
