// src/__tests__/utils/indexedDB.test.js
import { IndexedDBManager } from '../../utils/indexedDB';

describe('IndexedDB Manager', () => {
  beforeAll(async () => {
    await IndexedDBManager.initDB();
  });

  afterEach(async () => {
    // 테스트 데이터 정리
    const db = await IndexedDBManager.initDB();
    const transaction = db.transaction(['pulseData'], 'readwrite');
    const store = transaction.objectStore('pulseData');
    await store.clear();
  });

  test('should save and retrieve data', async () => {
    const testData = {
      name: '홍길동',
      timestamp: Date.now()
    };

    await IndexedDBManager.saveData(testData);
    const savedData = await IndexedDBManager.getData();
    
    expect(savedData[0]).toMatchObject(testData);
  });
});