import axios from 'axios';

const API_BASE_URL = 'https://server2-production-3c4c.up.railway.app';
const STORAGE_KEY = 'ubioUserData';

export const saveUserInfo = async (userData) => {
  try {
    const now = new Date();
    const submitData = {
      ...userData,
      measurementDate: now.toISOString()
    };

    console.log('저장할 데이터:', submitData);

    const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existingData.push(submitData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));

    return {
      success: true,
      data: submitData
    };
  } catch (error) {
    console.error('저장 오류:', error);
    return {
      success: false,
      error: error.message || '저장에 실패했습니다'
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