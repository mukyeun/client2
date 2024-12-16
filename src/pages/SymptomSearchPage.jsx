// client/src/pages/SymptomSearchPage.jsx
import React from 'react';
import SimpleSearchBar from '../components/SimpleSearchBar';
import useSymptomSearch from '../hooks/useSymptomSearch';
import './SymptomSearchPage.css';

const SymptomSearchPage = () => {
  const { searchResults, isSearching, searchSymptoms } = useSymptomSearch();

  const handleSearch = (searchTerm) => {
    searchSymptoms(searchTerm);
  };

  return (
    <div className="symptom-search-page">
      <h1>증상 검색</h1>
      <SimpleSearchBar onSearch={handleSearch} />
      
      {isSearching && <div className="loading">검색 중...</div>}
      
      <div className="search-results">
        {searchResults.length > 0 ? (
          <ul className="results-list">
            {searchResults.map((result, index) => (
              <li key={index} className="result-item">
                <div className="result-category">{result.대분류} &gt; {result.중분류}</div>
                <div className="result-symptom">{result.증상}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-results">
            {searchResults.length === 0 && !isSearching && "검색 결과가 없습니다."}
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomSearchPage;