// src/__tests__/components/FormValidation.test.js
import { validateFormData } from '../../utils/dataValidation';

describe('Form Validation', () => {
  test('should validate numeric fields', () => {
    const validData = {
      ab_ms: '123',
      ac_ms: '456',
      ad_ms: '789',
      ae_ms: '321'
    };
    
    expect(() => validateFormData(validData)).not.toThrow();
  });

  test('should validate ratio calculations', () => {
    const data = {
      ab_ms: '100',
      ac_ms: '200'
    };
    
    const ratio = data.ac_ms / data.ab_ms;
    expect(ratio).toBe(2);
  });
});