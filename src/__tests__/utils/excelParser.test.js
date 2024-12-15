// src/__tests__/utils/excelParser.test.js
import { parseExcelFile } from '../../utils/excelParser';

describe('Excel Parser', () => {
  test('should parse valid excel file', async () => {
    const mockFile = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const result = await parseExcelFile(mockFile);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBeTruthy();
  });

  test('should handle invalid file format', async () => {
    const mockFile = new File([''], 'test.txt', {
      type: 'text/plain'
    });
    
    await expect(parseExcelFile(mockFile))
      .rejects.toThrow('지원하지 않는 파일 형식입니다');
  });
});