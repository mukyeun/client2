import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
const STORAGE_KEY = 'ubioUserData';

export const saveUserInfo = (userData) => {
  try {
    // 기존 데이터 불러오기
    const existingData = localStorage.getItem(STORAGE_KEY);
    const dataArray = existingData ? JSON.parse(existingData) : [];
    
    // 새 데이터 추가
    const newData = {
      ...userData,
      _id: Date.now().toString(), // 고유 ID 생성
      createdAt: new Date().toISOString() // 생성 시간 추가
    };
    
    dataArray.push(newData);
    
    // 로컬 스토리지에 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataArray));
    console.log('데이터 저장됨:', newData);
    
    return {
      success: true,
      data: newData
    };
  } catch (error) {
    console.error('데이터 저장 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getAllUserInfo = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsedData = data ? JSON.parse(data) : [];
    console.log('로컬 스토리지에서 불러온 데이터:', parsedData);
    
    return {
      success: true,
      data: parsedData
    };
  } catch (error) {
    console.error('로컬 스토리지 데이터 로드 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const deleteUserInfo = (id) => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsedData = data ? JSON.parse(data) : [];
    
    const filteredData = parsedData.filter(item => item._id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
    
    return {
      success: true
    };
  } catch (error) {
    console.error('데이터 삭제 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const updateUserInfo = (id, updatedData) => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsedData = data ? JSON.parse(data) : [];
    
    const updatedArray = parsedData.map(item => 
      item._id === id ? { ...item, ...updatedData } : item
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedArray));
    
    return {
      success: true,
      data: updatedArray.find(item => item._id === id)
    };
  } catch (error) {
    console.error('데이터 수정 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 