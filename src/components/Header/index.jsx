import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1>SmartPulse Human</h1>
      </div>
      <div className="header-center">
        <Link to="/">
          <button>데이터 입력</button>
        </Link>
        <Link to="/data">
          <button>데이터 조회</button>
        </Link>
      </div>
      <div className="header-right">
        {/* 필요한 경우 우측 요소 추가 */}
      </div>
    </header>
  );
};

export default Header; 