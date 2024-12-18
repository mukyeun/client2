import React, { useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import UserInfoForm from './components/UserInfoForm';
import UserDataTable from './components/UserDataTable';
import './App.css';

// 상수 정의
export const LOCAL_STORAGE_KEY = 'ubioUserData';

// API 함수들
export const saveUserInfo = async (userData) => {
  try {
    const existingData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    existingData.push(userData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingData));

    return {
      success: true,
      data: userData
    };
  } catch (error) {
    console.error('저장 오류:', error);
    return {
      success: false,
      error: '데이터 저장 중 오류가 발생했습니다'
    };
  }
};

export const getAllUserInfo = async () => {
  try {
    const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    return {
      success: true,
      data: localData
    };
  } catch (error) {
    console.error('데이터 조회 오류:', error);
    return {
      success: false,
      data: [],
      error: error.message
    };
  }
};

export const deleteUserInfo = async (id) => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsedData = data ? JSON.parse(data) : [];
    
    const updatedData = parsedData.filter(item => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
    
    return {
      success: true,
      data: updatedData
    };
  } catch (error) {
    console.error('삭제 오류:', error);
    throw error;
  }
};

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<UserInfoForm />} />
        <Route path="/data" element={<UserDataTable />} />
      </Routes>
    </div>
  );
}

export default App;