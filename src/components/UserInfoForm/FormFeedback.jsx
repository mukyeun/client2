// src/components/UserInfoForm/FormFeedback.jsx
import React from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Toast } from '../common/Toast';

export const FormFeedback = ({ isLoading, error, success }) => {
  return (
    <div className="form-feedback">
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {success && (
        <Toast 
          message="성공적으로 처리되었습니다." 
          type="success" 
          onClose={() => {}} 
        />
      )}
    </div>
  );
};