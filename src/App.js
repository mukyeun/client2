import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import UserInfoForm from './components/UserInfoForm';
import UserDataTable from './components/UserDataTable';
import MainPage from './pages/MainPage';
import SymptomSearchPage from './pages/SymptomSearchPage';
import './App.css';
import axios from 'axios';
import UserList from './components/UserList';

// 상수 정의
const API_BASE_URL = 'http://localhost:8080';
const STORAGE_KEY = 'userInfoData';

// API 함수들
export const saveUserInfo = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/userinfo`, userData);
    
    const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existingData.push(response.data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('API 오류:', error);
    return {
      success: false,
      error: error.response?.data?.message || '서버 오류가 발생했습니다'
    };
  }
};

export const getAllUserInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/userinfo`);
    
    const localData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const mergedData = [...response.data, ...localData];
    
    return {
      success: true,
      data: mergedData
    };
  } catch (error) {
    console.error('데이터 조회 오류:', error);
    const localData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return {
      success: false,
      data: localData,
      error: error.message
    };
  }
};

export const deleteUserInfo = async (id) => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsedData = data ? JSON.parse(data) : [];
    
    const updatedData = parsedData.filter(item => item._id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    
    return {
      success: true,
      data: updatedData
    };
  } catch (error) {
    console.error('Delete error:', error);
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