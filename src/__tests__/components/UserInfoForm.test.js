// src/__tests__/components/UserInfoForm.test.js
import { render, fireEvent, waitFor } from '@testing-library/react';
import UserInfoForm from '../../components/UserInfoForm';

describe('UserInfoForm Component', () => {
  test('should render form fields', () => {
    const { getByLabelText } = render(<UserInfoForm />);
    
    expect(getByLabelText('이름')).toBeInTheDocument();
    expect(getByLabelText('AB_ms')).toBeInTheDocument();
    expect(getByLabelText('AC_ms')).toBeInTheDocument();
  });

  test('should handle file upload', async () => {
    const { getByLabelText, getByText } = render(<UserInfoForm />);
    const fileInput = getByLabelText('파일 선택');
    
    const mockFile = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    
    await waitFor(() => {
      expect(getByText('파일이 선택되었습니다')).toBeInTheDocument();
    });
  });

  test('should show error for invalid submission', async () => {
    const { getByText } = render(<UserInfoForm />);
    const submitButton = getByText('저장');
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(getByText('필수 정보를 입력해주세요')).toBeInTheDocument();
    });
  });
});