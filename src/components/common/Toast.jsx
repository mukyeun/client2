// src/components/common/Toast.jsx
import React, { useEffect } from 'react';
import '../../styles/components/Toast.css';

export const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast ${type}`}>
      <span className="toast-message">{message}</span>
    </div>
  );
};