// src/__tests__/services/offlineService.test.js
import { OfflineService } from '../../services/offlineService';

describe('Offline Service', () => {
  test('should sync data when online', async () => {
    // 오프라인 데이터 준비
    const testData = {
      name: '홍길동',
      timestamp: Date.now()
    };
    
    await OfflineService.saveOfflineData(testData);
    const synced = await OfflineService.syncData();
    
    expect(synced).toBe(true);
  });

  test('should clear offline data after sync', async () => {
    await OfflineService.syncData();
    await OfflineService.clearOfflineData();
    
    const remainingData = await OfflineService.getOfflineData();
    expect(remainingData).toHaveLength(0);
  });
});