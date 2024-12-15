// src/__tests__/integration/formSubmission.test.js
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from '../../App';

describe('Form Submission Flow', () => {
  test('complete form submission flow', async () => {
    const { getByLabelText, getByText } = render(<App />);
    
    // 이름 입력
    const nameInput = getByLabelText('이름');
    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    
    // 파일 업로드
    const fileInput = getByLabelText('파일 선택');
    const mockFile = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [mockFile] } });
    });
    
    // 폼 제출
    const submitButton = getByText('저장');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(getByText('저장되었습니다')).toBeInTheDocument();
    });
  });
});