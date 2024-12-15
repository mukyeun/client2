import React, { useState, useEffect, useMemo, useCallback } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import EditModal from './EditModal';
import { getAllUserInfo, deleteUserInfo } from '../../api/userInfo';
import './UserDataTable.css';
import ErrorMessage from '../common/ErrorMessage';
import { exportToExcel, exportToCSV } from '../../utils/exportUtils';

const UserDataTable = () => {
  const [userData, setUserData] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: 50
  });

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    residentNumberPrefix: '',
    name: ''
  });

  // 1. 기본 유틸리티 함수들
  const formatDate = (dateString) => {
    try {
      if (!dateString) return '-';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '-';
      }
      return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } catch (error) {
      return '-';
    }
  };

  // 2. 데이터 처리 기본 함수들
  const getSortedData = useCallback((data) => {
    if (!data || !Array.isArray(data)) {
      console.warn('정렬할 데이터가 없거나 배열이 아닙니다:', data);
      return [];
    }

    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (!a || !b) return 0;
      
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // null/undefined 처리
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // 날짜 형식 처리
      if (sortConfig.key === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // 숫자 형식 처리
      if (['height', 'weight', 'bmi', 'pulse', 'systolicBP', 'diastolicBP'].includes(sortConfig.key)) {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [sortConfig]);

  // 3. 필터링 함수
  const getFilteredData = useCallback(() => {
    console.log('현재 userData:', userData); // 현재 데이터 상태 확인

    if (!userData || !Array.isArray(userData)) {
      console.warn('유효하지 않은 userData:', userData);
      return [];
    }

    return userData.filter(user => {
      if (!user) return false;

      // 날짜 필터
      if (filters.startDate && filters.endDate) {
        const userDate = new Date(user.createdAt);
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59); // 종료일을 해당 일의 마지막 시점으로 설정

        if (isNaN(userDate.getTime()) || userDate < start || userDate > end) {
          return false;
        }
      }

      // 이름 필터
      if (filters.name && user.name) {
        const searchName = filters.name.toLowerCase().trim();
        const userName = user.name.toLowerCase().trim();
        if (!userName.includes(searchName)) {
          return false;
        }
      }

      // 주민번호 필터
      if (filters.residentNumberPrefix && user.residentNumber) {
        const prefix = filters.residentNumberPrefix.trim();
        if (!user.residentNumber.startsWith(prefix)) {
          return false;
        }
      }

      return true;
    });
  }, [userData, filters]);

  // 4. 메모이제이션된 데이터
  const sortedData = useMemo(() => {
    const filteredData = getFilteredData();
    return getSortedData(filteredData);
  }, [getFilteredData, getSortedData]);

  // 5. 이벤트 핸들러들
  const handleSort = useCallback((key) => {
    setSortConfig(prevSort => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  useEffect(() => {
    loadUserData();
  }, []);

  const toggleCheckbox = useCallback((id, e) => {
    e.stopPropagation();
    setCheckedItems(prev => {
      const newCheckedItems = new Set(prev);
      if (newCheckedItems.has(id)) {
        newCheckedItems.delete(id);
      } else {
        newCheckedItems.add(id);
      }
      return newCheckedItems;
    });
  }, []);

  const toggleAllCheckboxes = (e) => {
    if (e.target.checked) {
      const allIds = userData.map(user => user._id);
      setCheckedItems(new Set(allIds));
    } else {
      setCheckedItems(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    if (checkedItems.size === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }

    if (window.confirm(`선택한 ${checkedItems.size}개의 데이터를 삭제하시겠습니까?`)) {
      setIsLoading(true);
      try {
        const deletePromises = Array.from(checkedItems).map(id => deleteUserInfo(id));
        await Promise.all(deletePromises);
        await loadUserData();
        setCheckedItems(new Set());
        alert('선택한 데이터가 삭제되었습니다.');
      } catch (error) {
        console.error('Delete error:', error);
        setError('데이터 삭제 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExport = async () => {
    try {
      await exportToExcel(userData);
    } catch (error) {
      console.error('Export failed:', error);
      // 에러 처리
    }
  };

  const handleBackup = () => {
    const dataToBackup = {
      timestamp: new Date().toISOString(),
      data: userData
    };
    const blob = new Blob([JSON.stringify(dataToBackup)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target.result);
          if (backup.data && Array.isArray(backup.data)) {
            setUserData(backup.data);
            alert('데이터가 복원되었습니다.');
          } else {
            throw new Error('Invalid backup format');
          }
        } catch (error) {
          alert('백업 파일을 읽는 중 오류가 발생했습니다.');
        }
      };
      reader.readAsText(file);
    }
  };

  const visibleData = useMemo(() => {
    return sortedData.slice(visibleRange.start, visibleRange.end);
  }, [sortedData, visibleRange]);

  const handleTableScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    if (scrollHeight - scrollTop - clientHeight < 200) {
      setVisibleRange(prev => ({
        start: 0,
        end: Math.min(prev.end + 50, sortedData.length)
      }));
    }
  }, [sortedData.length]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditComplete = async (updatedUser) => {
    try {
      const allData = await getAllUserInfo();
      const updatedData = allData.data.map(user => 
        user._id === updatedUser._id ? updatedUser : user
      );
      setUserData(updatedData);
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Edit error:', error);
      alert('데이터 수정 중 오류가 발생했습니다.');
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      residentNumberPrefix: '',
      name: ''
    });
  };

  const renderRow = useCallback((user, index) => (
    <tr key={user._id}>
      <td className="checkbox-cell">
        <input
          type="checkbox"
          className="custom-checkbox"
          checked={checkedItems.has(user._id)}
          onChange={() => toggleCheckbox(user._id)}
          id={`checkbox-${user._id}`}
        />
        <label htmlFor={`checkbox-${user._id}`} className="checkbox-cell"></label>
      </td>
      <td>{user.createdAt}</td>
      <td>{user.name}</td>
      <td>{user.residentNumber}</td>
      <td>{user.gender}</td>
      <td>{user.height}</td>
      <td>{user.weight}</td>
      <td>{user.bmi}</td>
      <td>{user.stress}</td>
      <td>{user.workIntensity}</td>
      <td>{user.pulse}</td>
      <td>{user.systolicBP}</td>
      <td>{user.diastolicBP}</td>
      <td>{user.pvc}</td>
      <td>{user.bv}</td>
      <td>{user.sv}</td>
      <td>{Array.isArray(user.selectedSymptoms) ? user.selectedSymptoms.join(', ') : user.selectedSymptoms}</td>
      <td>{user.medication}</td>
      <td>{user.preference}</td>
      <td>{user.memo}</td>
      <td className="action-cell">
        <button 
          onClick={() => handleEdit(user)}
          className="edit-button"
        >
          수정
        </button>
      </td>
    </tr>
  ), [checkedItems, toggleCheckbox]);

  // 1. 정렬 아이콘 렌더링 함수
  const renderSortIcon = useCallback((key) => {
    if (sortConfig.key !== key) {
      return <span className="sort-icon">⇅</span>;
    }
    return sortConfig.direction === 'asc' 
      ? <span className="sort-icon">↑</span>
      : <span className="sort-icon">↓</span>;
  }, [sortConfig]);

  // 2. 데이터 로드 함수
  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAllUserInfo();
      console.log('API 응답:', result); // 데이터 확인용 로그

      if (result && result.data) {
        setUserData(result.data);
        console.log('설정된 userData:', result.data); // 상태 업데이트 확인
      } else {
        throw new Error('데이터 형식이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('데이터 로딩 에러:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      setUserData([]); // 에러 시 빈 배열로 초기화
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. useEffect로 초기 데이터 로드
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // useEffect에서 주기적으로 데이터 새로고침
  useEffect(() => {
    loadUserData(); // 초기 로드
    
    const refreshInterval = setInterval(() => {
      loadUserData();
    }, 30000); // 30초마다 새로고침

    return () => clearInterval(refreshInterval);
  }, [loadUserData]);

  // API 응답 구조 확인을 위한 콘솔 로그 추가
  useEffect(() => {
    console.log('필터링된 데이터:', getFilteredData());
  }, [getFilteredData]);

  return (
    <div className="data-page-container">
      {isLoading && <LoadingSpinner overlay message="데이터를 불러오는 중..." />}
      
      <div className="data-header">
        <h2>환자 데이터 조회</h2>
        <div className="header-buttons">
          <button 
            onClick={handleDeleteSelected}
            className="delete-selected-button"
            disabled={checkedItems.size === 0}
          >
            선택 삭제 ({checkedItems.size})
          </button>
          <button onClick={loadUserData} className="refresh-button">
            새로고침
          </button>
          <div className="export-buttons">
            <button onClick={handleExport} className="export-button excel">
              Excel 내보내기
            </button>
            <button onClick={() => handleExport('csv')} className="export-button csv">
              CSV 내보내기
            </button>
          </div>
          <div className="backup-controls">
            <button onClick={handleBackup} className="backup-button">
              백업
            </button>
            <label className="restore-button">
              복원
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="table-filters">
        <div className="filter-group">
          <label>등록일자</label>
          <input 
            type="date" 
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
          <span>~</span>
          <input 
            type="date" 
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>이름</label>
          <input 
            type="text" 
            placeholder="이름으로 검색"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>주민등록번호</label>
          <input 
            type="text" 
            placeholder="주민등록번호 앞자리"
            value={filters.residentNumberPrefix}
            onChange={(e) => handleFilterChange('residentNumberPrefix', e.target.value)}
          />
        </div>

        <button 
          className="reset-filter-button"
          onClick={handleResetFilters}
        >
          필터 초기화
        </button>
      </div>

      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => {
            setError(null);
            loadUserData();
          }} 
        />
      )}

      <div 
        className="table-wrapper" 
        onScroll={handleTableScroll}
        role="region" 
        aria-label="환자 데이터 테이블"
      >
        <div className="table-controls">
          <div className="items-per-page">
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(e)}
              className="items-per-page-select"
            >
              <option value="10">10개씩 보기</option>
              <option value="20">20개씩 보기</option>
              <option value="50">50개씩 보기</option>
              <option value="100">100개씩 보기</option>
            </select>
          </div>
          <div className="data-info">
            총 {getFilteredData().length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, getFilteredData().length)}개 표시
          </div>
        </div>

        <table 
          className="user-data-table"
          role="grid"
          aria-label="환자 목록"
        >
          <thead>
            <tr role="row">
              <th role="columnheader" aria-label="선택">
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={userData.length > 0 && checkedItems.size === userData.length}
                  onChange={toggleAllCheckboxes}
                  aria-label="모든 항목 선택"
                />
              </th>
              <th onClick={() => handleSort('createdAt')} className="sortable-header">
                등록일시 {renderSortIcon('createdAt')}
              </th>
              <th onClick={() => handleSort('name')} className="sortable-header">
                이름 {renderSortIcon('name')}
              </th>
              <th onClick={() => handleSort('residentNumber')} className="sortable-header">
                주민등록번호 {renderSortIcon('residentNumber')}
              </th>
              <th onClick={() => handleSort('gender')} className="sortable-header">
                성별 {renderSortIcon('gender')}
              </th>
              <th onClick={() => handleSort('height')} className="sortable-header">
                신장(cm) {renderSortIcon('height')}
              </th>
              <th onClick={() => handleSort('weight')} className="sortable-header">
                체중(kg) {renderSortIcon('weight')}
              </th>
              <th onClick={() => handleSort('bmi')} className="sortable-header">
                BMI {renderSortIcon('bmi')}
              </th>
              <th onClick={() => handleSort('stress')} className="sortable-header">
                스트레스 {renderSortIcon('stress')}
              </th>
              <th onClick={() => handleSort('workIntensity')} className="sortable-header">
                노동강도 {renderSortIcon('workIntensity')}
              </th>
              <th onClick={() => handleSort('pulse')} className="sortable-header">
                맥박(회/분) {renderSortIcon('pulse')}
              </th>
              <th onClick={() => handleSort('systolicBP')} className="sortable-header">
                수축기 혈압 {renderSortIcon('systolicBP')}
              </th>
              <th onClick={() => handleSort('diastolicBP')} className="sortable-header">
                이완기 혈압 {renderSortIcon('diastolicBP')}
              </th>
              <th onClick={() => handleSort('pvc')} className="sortable-header">
                PVC {renderSortIcon('pvc')}
              </th>
              <th onClick={() => handleSort('bv')} className="sortable-header">
                BV {renderSortIcon('bv')}
              </th>
              <th onClick={() => handleSort('sv')} className="sortable-header">
                SV {renderSortIcon('sv')}
              </th>
              <th onClick={() => handleSort('selectedSymptoms')} className="sortable-header">
                증상 {renderSortIcon('selectedSymptoms')}
              </th>
              <th onClick={() => handleSort('medication')} className="sortable-header">
                복용약물 {renderSortIcon('medication')}
              </th>
              <th onClick={() => handleSort('preference')} className="sortable-header">
                기호식품 {renderSortIcon('preference')}
              </th>
              <th onClick={() => handleSort('memo')} className="sortable-header">
                메모 {renderSortIcon('memo')}
              </th>
              <th className="action-cell">
                액션
              </th>
            </tr>
          </thead>
          <tbody>
            {getFilteredData()
              .slice(visibleRange.start, visibleRange.end)
              .map((user, index) => (
                <tr key={user._id || `row-${index}`} role="row">
                  <td role="gridcell">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={checkedItems.has(user._id)}
                      onChange={(e) => toggleCheckbox(user._id, e)}
                      aria-label={`${user.name} 선택`}
                      id={`checkbox-${user._id}`}
                    />
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{user.name}</td>
                  <td>{user.residentNumber}</td>
                  <td>{user.gender}</td>
                  <td>{user.height}</td>
                  <td>{user.weight}</td>
                  <td>{user.bmi}</td>
                  <td>{user.stress}</td>
                  <td>{user.workIntensity}</td>
                  <td>{user.pulse}</td>
                  <td>{user.systolicBP}</td>
                  <td>{user.diastolicBP}</td>
                  <td>{user.pvc}</td>
                  <td>{user.bv}</td>
                  <td>{user.sv}</td>
                  <td>{Array.isArray(user.selectedSymptoms) ? user.selectedSymptoms.join(', ') : user.selectedSymptoms}</td>
                  <td>{user.medication}</td>
                  <td>{user.preference}</td>
                  <td>{user.memo}</td>
                  <td className="action-cell">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="edit-button"
                    >
                      수정
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {visibleRange.end < sortedData.length && (
          <div className="loading-more">
            <LoadingSpinner message="추가 데이터를 불러오는 중..." />
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <EditModal
          user={editingUser}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditComplete}
        />
      )}
    </div>
  
  );
};

export default UserDataTable;