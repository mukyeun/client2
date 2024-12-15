import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1>SmartPulse Human</h1>
      <div className="header-buttons">
        <button>데이터 입력</button>
        <button>데이터 조회</button>
      </div>
    </header>
  );
};

export default Header; 