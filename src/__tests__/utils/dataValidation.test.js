// src/__tests__/utils/dataValidation.test.js
import { validateFormData } from '../../utils/dataValidation';

describe('Form Data Validation', () => {
  test('should validate complete form data', () => {
    const validData = {
      name: '홍길동',
      ab_ms: '123',
      ac_ms: '456',
      ad_ms: '789',
      ae_ms: '321'
    };
    expect(() => validateFormData(validData)).not.toThrow();
  });

  test('should throw error for missing required fields', () => {
    const invalidData = {
      name: '홍길동',
      ab_ms: '123'
      // 누락된 필드들
    };
    expect(() => validateFormData(invalidData))
      .toThrow('필수 필드가 누락되었습니다');
  });

  test('should throw error for invalid numeric values', () => {
    const invalidData = {
      name: '홍길동',
      ab_ms: 'invalid',
      ac_ms: '456',
      ad_ms: '789',
      ae_ms: '321'
    };
    expect(() => validateFormData(invalidData))
      .toThrow('유효하지 않은 숫자 형식입니다');
  });
});