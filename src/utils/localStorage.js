// 로컬 스토리지 관리 유틸리티
export const saveData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('저장 실패:', error);
      return false;
    }
  };
  
  export const loadData = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('로드 실패:', error);
      return null;
    }
  };