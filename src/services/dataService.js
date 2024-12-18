import { saveData, loadData } from '../utils/localStorage';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://server2-production-3c4c.up.railway.app';

// localStorage 초기화 함수
const clearLocalStorage = () => {
  try {
    localStorage.removeItem('userData');
    return true;
  } catch (error) {
    console.error('localStorage 초기화 실패:', error);
    return false;
  }
};

class DataServiceClass {
  async saveUserData(userData) {
    try {
      const serverResponse = await axios.post(`${API_BASE_URL}/api/userinfo`, userData);
      saveData('userData', [userData]);
      return {
        success: true,
        data: userData,
        serverResponse: serverResponse.data
      };
    } catch (error) {
      console.error('데이터 저장 실패:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getUserData() {
    try {
      const serverResponse = await axios.get(`${API_BASE_URL}/api/userinfo`);
      if (serverResponse.data && serverResponse.data.data) {
        saveData('userData', serverResponse.data.data);
        return serverResponse.data.data;
      }
      return [];
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      const localData = loadData('userData');
      return Array.isArray(localData) ? localData : [];
    }
  }

  async getLatestUserData(userName) {
    const allData = await this.getUserData();
    if (!Array.isArray(allData)) return null;
    
    return allData
      .filter(data => data && data.name === userName)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;
  }

  clearLocalData() {
    return clearLocalStorage();
  }
}

// 싱글톤 인스턴스 생성 및 export
export const DataService = new DataServiceClass();