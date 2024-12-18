import axios from 'axios';

const USER_DATA_KEY = 'userData';

export const initializeLocalStorage = () => {
  localStorage.removeItem(USER_DATA_KEY);
};

export const saveUserInfo = (userData) => {
  try {
    const existingData = getAllUserInfo();
    const timestamp = new Date().toISOString();
    
    const newData = {
      ...userData,
      _id: userData._id || Date.now().toString(),
      createdAt: userData.createdAt || timestamp,
      updatedAt: timestamp
    };

    const updatedData = existingData.map(item => 
      item._id === newData._id ? newData : item
    );

    if (!existingData.find(item => item._id === newData._id)) {
      updatedData.push(newData);
    }

    localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedData));
    return newData;
  } catch (error) {
    console.error('Failed to save user info to localStorage:', error);
    throw error;
  }
};

export const getAllUserInfo = () => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    if (!data) return [];
    
    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error('Failed to get user info from localStorage:', error);
    return [];
  }
};

export const deleteUserInfo = (id) => {
  try {
    const existingData = getAllUserInfo();
    const filteredData = existingData.filter(item => item._id !== id);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(filteredData));
    return true;
  } catch (error) {
    console.error('Failed to delete user info from localStorage:', error);
    throw error;
  }
};

export const updateUserInfo = (id, updatedData) => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    const parsedData = data ? JSON.parse(data) : [];
    
    const updatedArray = parsedData.map(item => 
      item._id === id ? { ...item, ...updatedData } : item
    );
    
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedArray));
    
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