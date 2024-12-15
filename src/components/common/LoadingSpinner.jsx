// src/components/common/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ overlay, message = '데이터를 불러오는 중...' }) => (
  <>
    {overlay && <div className="loading-spinner-overlay" />}
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  </>
);

export default LoadingSpinner;