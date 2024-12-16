import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://server2-production-3c4c.up.railway.app';
const STORAGE_KEY = 'ubioUserData';

export const saveUserInfo = async (userData) => {
  try {
    // 서버에 데이터 저장
    const serverResponse = await axios.post(`${API_BASE_URL}/api/userinfo`, userData);
    
    // 기존 로컬 스토리지 로직 유지
    const existingData = localStorage.getItem(STORAGE_KEY);
    const dataArray = existingData ? JSON.parse(existingData) : [];
    
    const newData = {
      ...userData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    dataArray.push(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataArray));
    console.log('데이터 저장됨:', newData);
    
    return {
      success: true,
      data: newData,
      serverResponse: serverResponse.data
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