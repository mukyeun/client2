// src/__tests__/utils/localStorage.test.js
import { saveData, loadData } from '../../utils/localStorage';

describe('LocalStorage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should save and load data', () => {
    const testData = {
      name: '홍길동',
      ab_ms: '123'
    };
    
    saveData('testKey', testData);
    const loadedData = loadData('testKey');
    
    expect(loadedData).toEqual(testData);
  });

  test('should handle invalid data', () => {
    const loadedData = loadData('nonexistentKey');
    expect(loadedData).toBeNull();
  });
});