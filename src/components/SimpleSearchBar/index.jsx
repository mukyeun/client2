// client/src/components/SimpleSearchBar/index.jsx
import React, { useState } from 'react';
import './SimpleSearchBar.css';

const SimpleSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form className="simple-search" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="증상을 검색하세요"
        className="search-input"
      />
      <button type="submit" className="search-button">검색</button>
    </form>
  );
};

export default SimpleSearchBar;