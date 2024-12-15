import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const DataManager = ({ children }) => {
  const [userData, setUserData] = useLocalStorage('userData', []);

  const contextValue = {
    userData,
    setUserData,
    // 추가 데이터 관리 메서드들
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};