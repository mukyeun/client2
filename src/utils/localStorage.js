// localStorage 유틸리티 함수
export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('localStorage 저장 실패:', error);
    return false;
  }
};

export const loadData = (key) => {
  try {
    const item = localStorage.getItem(key);
    // 데이터가 없으면 null 반환
    if (!item) return null;
    
    return JSON.parse(item);
  } catch (error) {
    console.error('localStorage 로드 실패:', error);
    return null;
  }
};

export const clearData = (key) => {
  try {
    if (key) {
      localStorage.removeItem(key);
    } else {
      localStorage.clear();
    }
    return true;
  } catch (error) {
    console.error('localStorage 삭제 실패:', error);
    return false;
  }
};