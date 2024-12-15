// src/__tests__/hooks/useOfflineStorage.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { useOfflineStorage } from '../../hooks/useOfflineStorage';

describe('useOfflineStorage Hook', () => {
  test('should detect online status', () => {
    const { result } = renderHook(() => useOfflineStorage());
    
    expect(result.current.isOnline).toBe(navigator.onLine);
  });

  test('should save offline data', async () => {
    const { result } = renderHook(() => useOfflineStorage());
    
    const testData = {
      name: '홍길동',
      timestamp: Date.now()
    };

    await act(async () => {
      const saved = await result.current.saveOfflineData(testData);
      expect(saved).toBe(true);
    });
  });
});