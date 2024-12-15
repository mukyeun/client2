import { useState, useEffect } from 'react';
import { IndexedDBManager } from '../utils/indexedDB';

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveOfflineData = async (data) => {
    try {
      await IndexedDBManager.saveData(data);
      const allData = await IndexedDBManager.getData();
      setOfflineData(allData);
      return true;
    } catch (error) {
      console.error('오프라인 저장 실패:', error);
      return false;
    }
  };

  return {
    isOnline,
    offlineData,
    saveOfflineData
  };
};