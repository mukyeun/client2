import { useState, useEffect } from 'react';
import { saveData, loadData } from '../utils/localStorage';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    return loadData(key) || initialValue;
  });

  const setValue = (value) => {
    setStoredValue(value);
    saveData(key, value);
  };

  return [storedValue, setValue];
};