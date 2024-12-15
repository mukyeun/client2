// src/utils/memoization.js
export const memoize = (fn) => {
    const cache = new Map();
    
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  };
  
  // 계산 집약적인 함수에 적용
  export const calculateRatios = memoize((data) => {
    return {
      ba_ratio: data.ab_ms ? (data.ba_ms / data.ab_ms).toFixed(2) : '',
      ca_ratio: data.ac_ms ? (data.ca_ms / data.ac_ms).toFixed(2) : '',
      // ... 기타 계산
    };
  });