import { saveData, loadData } from '../utils/localStorage';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://server2-production-3c4c.up.railway.app';

export class DataService {
  static async saveUserData(userData) {
    try {
      // 서버에 데이터 저장
      const serverResponse = await axios.post(`${API_BASE_URL}/api/userinfo`, userData);
      
      // 로컬 스토리지에도 저장
      const existingData = loadData('userData') || [];
      const updatedData = [...existingData, userData];
      saveData('userData', updatedData);

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

  static async getUserData() {
    try {
      // 서버에서 데이터 가져오기
      const serverResponse = await axios.get(`${API_BASE_URL}/api/userinfo`);
      
      // 로컬 데이터도 유지
      const localData = loadData('userData') || [];
      
      return serverResponse.data.data;
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      return loadData('userData') || []; // 서버 실패시 로컬 데이터 반환
    }
  }

  static async getLatestUserData(userName) {
    const allData = await this.getUserData();
    return allData
      .filter(data => data.name === userName)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }
}