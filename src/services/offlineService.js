import { IndexedDBManager } from '../utils/indexedDB';

export class OfflineService {
  static async syncData() {
    try {
      const offlineData = await IndexedDBManager.getData();
      // 여기에 동기화 로직 추가
      return true;
    } catch (error) {
      console.error('동기화 실패:', error);
      return false;
    }
  }

  static async clearOfflineData() {
    // 오프라인 데이터 정리 로직
  }
}