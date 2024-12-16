// client/src/hooks/useSymptomSearch.js
import { useState, useCallback } from 'react';
import { 증상카테고리 } from '../data/symptoms';

const useSymptomSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchSymptoms = useCallback((searchTerm) => {
    setIsSearching(true);
    const results = [];

    try {
      // 검색어가 비어있으면 빈 결과 반환
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      // 대분류-중분류-증상을 순회하며 검색
      Object.entries(증상카테고리).forEach(([대분류, 중분류객체]) => {
        Object.entries(중분류객체).forEach(([중분류, 증상배열]) => {
          증상배열.forEach(증상 => {
            if (증상.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              results.push({
                대분류,
                중분류,
                증상: 증상.name
              });
            }
          });
        });
      });

      setSearchResults(results);
    } catch (error) {
      console.error('증상 검색 중 오류 발생:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    searchResults,
    isSearching,
    searchSymptoms
  };
};

export default useSymptomSearch;