import { saveData, loadData } from '../utils/localStorage';

export class DataService {
  static async saveUserData(userData) {
    const existingData = loadData('userData') || [];
    const updatedData = [...existingData, userData];
    return saveData('userData', updatedData);
  }

  static getUserData() {
    return loadData('userData') || [];
  }

  static getLatestUserData(userName) {
    const allData = this.getUserData();
    return allData
      .filter(data => data.name === userName)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }
}