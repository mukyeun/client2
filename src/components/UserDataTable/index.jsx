import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import EditModal from './EditModal';
import { getAllUserInfo, deleteUserInfo, saveUserInfo, initializeLocalStorage } from '../../api/userInfo';
import './UserDataTable.css';
import ErrorMessage from '../common/ErrorMessage';
import { exportToExcel, exportToCSV } from '../../utils/exportUtils';
import { read, utils } from 'xlsx';
import * as ExcelJS from 'exceljs';
// localStorage 키 상수 정의
const LOCAL_STORAGE_KEY = 'ubioUserData';  // UserInfoForm과 동일한 키 사용
const UserDataTable = () => {
  // 상태 관리
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  
  // 정렬, 필터링, 페이지네이션 상태
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filters, setFilters] = useState({
    name: '',
    residentNumber: '',
    gender: '',
    birthDate: '',
    phone: '',
    address: '',
    createdAt: ''
  });
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: itemsPerPage
  });
  // loadUserData 함수 선언
  const loadUserData = useCallback(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      console.log('원본 저장 데이터:', savedData);  // 디버깅용 로그
      
      if (!savedData) {
        setUserData([]);
        return;
      }

      const parsedData = JSON.parse(savedData);
      console.log('파싱된 데이터:', parsedData);  // 디버깅용 로그

      // 데이터 구조 확인 및 처리
      let processedData;
      if (Array.isArray(parsedData)) {
        processedData = parsedData;
      } else if (parsedData.data && Array.isArray(parsedData.data)) {
        processedData = parsedData.data;
      } else {
        processedData = [parsedData];
      }

      // 데이터 정제
      const cleanData = processedData.filter(item => item && typeof item === 'object');
      console.log('최종 처리된 데이터:', cleanData);  // 디버깅용 로그
      
      setUserData(cleanData);
    } catch (error) {
      console.error('데이터 로드 오류:', error);
      setUserData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  // handleEditComplete 함수 선언
  const handleEditComplete = useCallback(async () => {
    await loadUserData();
    setIsEditModalOpen(false);
    setEditingUser(null);
  }, [loadUserData]);
  // 컴포넌트 마운트 시 로컬 데이터 로드
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);
  // 페이지 변경 시 visibleRange 업데이트
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setVisibleRange({ start, end });
  }, [currentPage, itemsPerPage]);
  // 정렬 핸들러
  const handleSort = useCallback((key) => {
    setSortConfig(prevSort => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);
  // 필터 핸들러
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // 터 변경 시 첫 페이지로 이동
  }, []);
  // 페이지 크기 변경 핸들러
  const handleItemsPerPageChange = useCallback((newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  }, []);
  // EditModal 컴포넌트
  const renderEditModal = () => {
    if (!isEditModalOpen) return null;
    return (
      <EditModal
        user={editingUser}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSave}
      />
    );
  };
  // 1. 기본 유틸리티 함수들
  const formatDate = (date) => {
    if (!date) {
      const now = new Date();
      // 밀리초 단까지 포함하여 더 정확한 시간 표시
      return now.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
      });
    }
    const d = new Date(date);
    return d.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
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
      // 짜 형식 처리
      if (sortConfig.key === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // 자 형식 처리
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
    console.log('getFilteredData 호출됨, userData:', userData);
    
    if (!Array.isArray(userData)) {
      return [];
    }
    const filteredData = userData;
    console.log('필터링된 데이터:', filteredData);
    return filteredData;
  }, [userData]);
  // 4. 메모이제이션된 데이터
  const sortedData = useMemo(() => {
    const filteredData = getFilteredData();
    return getSortedData(filteredData);
  }, [getFilteredData, getSortedData]);
  // 5. 이벤트 핸들러들
  const handleCheckboxChange = useCallback((id) => {
    setCheckedIds(prev => {
      const isChecked = prev.includes(id);
      if (isChecked) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);
  const toggleAllCheckboxes = useCallback(() => {
    const filteredData = getFilteredData();
    const filteredIds = filteredData.map(item => item._id);
    
    setCheckedIds(prev => {
      // 현재 필터링된 항목들이 모두 체크되어 있는지 확인
      const allFilteredChecked = filteredIds.every(id => prev.includes(id));
      
      if (allFilteredChecked) {
        // 필터링된 항목들만 체크 해제
        return prev.filter(id => !filteredIds.includes(id));
      } else {
        // 필터링된 항목들 추가 (기존 체크된 항목 유지)
        return [...new Set([...prev, ...filteredIds])];
      }
    });
  }, [getFilteredData]);
  const handleExport = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('User Data');

      // 헤더 설정
      worksheet.columns = [
        { header: '이름', key: 'name', width: 15 },
        { header: '생성일', key: 'createdAt', width: 20 },
        { header: '성별', key: 'gender', width: 10 },
        { header: '키', key: 'height', width: 10 },
        { header: '체중', key: 'weight', width: 10 },
        { header: 'BMI', key: 'bmi', width: 10 },
        { header: '맥박', key: 'pulse', width: 10 },
        { header: '수축기혈압', key: 'systolicBP', width: 15 },
        { header: '이완기혈압', key: 'diastolicBP', width: 15 },
        { header: 'ab_ms', key: 'ab_ms', width: 10 },
        { header: 'ac_ms', key: 'ac_ms', width: 10 },
        { header: 'ad_ms', key: 'ad_ms', width: 10 },
        { header: 'ae_ms', key: 'ae_ms', width: 10 },
        { header: 'ba_ratio', key: 'ba_ratio', width: 10 },
        { header: 'ca_ratio', key: 'ca_ratio', width: 10 },
        { header: 'da_ratio', key: 'da_ratio', width: 10 },
        { header: 'ea_ratio', key: 'ea_ratio', width: 10 },
        { header: 'PVC', key: 'pvc', width: 10 },
        { header: 'BV', key: 'bv', width: 10 },
        { header: 'SV', key: 'sv', width: 10 },
        { header: 'HR', key: 'hr', width: 10 },
        { header: '증상', key: 'symptoms', width: 30 },
        { header: '복용약물', key: 'medication', width: 20 },
        { header: '기호식품', key: 'preference', width: 15 },
        { header: '메모', key: 'memo', width: 30 }
      ];

      // 데이터 추가
      const rows = userData.map(user => ({
        name: user.name || '',
        email: user.email || '',
        createdAt: user.createdAt ? new Date(user.createdAt).toLocaleString() : '',
        gender: user.gender || '',
        height: user.height || '',
        weight: user.weight || '',
        bmi: user.bmi || '',
        pulse: user.pulse || '',
        systolicBP: user.systolicBP || '',
        diastolicBP: user.diastolicBP || '',
        ab_ms: user.ab_ms || '',
        ac_ms: user.ac_ms || '',
        ad_ms: user.ad_ms || '',
        ae_ms: user.ae_ms || '',
        ba_ratio: user.ba_ratio || '',
        ca_ratio: user.ca_ratio || '',
        da_ratio: user.da_ratio || '',
        ea_ratio: user.ea_ratio || '',
        pvc: user.pvc || '',
        bv: user.bv || '',
        sv: user.sv || '',
        hr: user.hr || '',
        symptoms: Array.isArray(user.symptoms) ? user.symptoms.join(', ') : user.symptoms || '',
        medication: user.medication || '',
        preference: user.preference || '',
        memo: user.memo || ''
      }));

      worksheet.addRows(rows);

      // 스타일 적용
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // 파일 저장
      workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user_data_${new Date().toISOString().split('T')[0]}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      });

    } catch (error) {
      console.error('엑셀 내보내기 오류:', error);
      alert('엑셀 파일 생성 중 오류가 발생했습니다.');
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
            alert('데이터 복원되었습니다.');
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
  const handleResetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      residentNumberPrefix: '',
      name: ''
    });
  };
  const handleDelete = async () => {
    if (checkedIds.length === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }
    if (window.confirm(`선택한 ${checkedIds.length}개 항목을 삭제하시겠습니까?`)) {
      try {
        await Promise.all(checkedIds.map(id => deleteUserInfo(id)));
        setCheckedIds([]);
        await loadUserData();
        alert('삭제가 완료되었습니다.');
      } catch (error) {
        console.error('Delete error:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };
  const renderRow = useCallback((user, index) => (
    <tr key={user._id}>
      <td className="checkbox-cell">
        <input
          type="checkbox"
          className="custom-checkbox"
          checked={checkedIds.includes(user._id)}
          onChange={(e) => handleCheckboxChange(user._id)}
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
      <td>{user.pulse}</td>
      <td>{user.systolicBP}</td>
      <td>{user.diastolicBP}</td>
      <td>{user.ab_ms}</td>
      <td>{user.ac_ms}</td>
      <td>{user.ad_ms}</td>
      <td>{user.ae_ms}</td>
      <td>{user.ba_ratio}</td>
      <td>{user.ca_ratio}</td>
      <td>{user.da_ratio}</td>
      <td>{user.ea_ratio}</td>
      <td>{user.pvc}</td>
      <td>{user.bv}</td>
      <td>{user.sv}</td>
      <td>{user.hr}</td>
      <td>{Array.isArray(user.symptoms) ? user.symptoms.join(', ') : user.symptoms}</td>
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
  ), [checkedIds, handleCheckboxChange]);
  // 1. 정렬 아이콘 렌더링 함수
  const renderSortIcon = useCallback((key) => {
    if (sortConfig.key !== key) {
      return <span className="sort-icon">⇅</span>;
    }
    return sortConfig.direction === 'asc' 
      ? <span className="sort-icon">↑</span>
      : <span className="sort-icon">↓</span>;
  }, [sortConfig]);
  // 체크박스 상태 계산을 위한 메모이제이션
  const { isAllChecked, isIndeterminate } = useMemo(() => {
    const filteredData = getFilteredData();
    if (!filteredData.length) {
      return { isAllChecked: false, isIndeterminate: false };
    }
    const filteredIds = filteredData.map(item => item._id);
    const checkedFilteredCount = filteredIds.filter(id => checkedIds.includes(id)).length;
    return {
      isAllChecked: checkedFilteredCount === filteredData.length && checkedFilteredCount > 0,
      isIndeterminate: checkedFilteredCount > 0 && checkedFilteredCount < filteredData.length
    };
  }, [getFilteredData, checkedIds]);
  // 데이터가 변경될 때 체크박스 상태 초기화
  useEffect(() => {
    setCheckedIds([]);
  }, [userData]);
  // EditModal 저장 로직 수정
  const handleSave = useCallback(async (formData) => {
    try {
      // 1. 저장 시도
      console.log('Saving data:', formData);
      await saveUserInfo(formData);
      
      // 2. 즉시 데이터 새로고침
      const freshData = await loadUserData();
      console.log('Fresh data after save:', freshData);
      
      // 3. UI 업데이트
      setIsEditModalOpen(false);
      setEditingUser(null);
      
      // 4. 성공 메시지
      alert('저장이 완료되었습니다.');
      
    } catch (error) {
      console.error('Save failed:', error);
      alert('저장 실패: ' + (error.message || '알 수 없는 오류'));
    }
  }, [loadUserData]);
  // 데이터 변경 감지를 위한 useEffect 추가
  useEffect(() => {
    console.log('userData updated:', userData);
  }, [userData]);
  // 엑셀 데이터 처리 함수 수정
  const processExcelData = useCallback((excelData) => {
    if (!excelData || !Array.isArray(excelData)) {
      console.error('Invalid excel data format:', excelData);
      return null;
    }
    try {
      const mappedData = excelData.map(row => ({
        name: row['이름'] || '',
        residentNumber: row['주민번호'] || '',
        gender: row['성별'] || '',
        height: row['신장'] || '',
        weight: row['체중'] || '',
        bmi: row['BMI'] || '',
        pulse: row['맥박'] || '',
        systolicBP: row['수축기혈압'] || '',
        diastolicBP: row['이완기혈압'] || '',
        ab_ms: row['a-b'] || '',
        ac_ms: row['a-c'] || '',
        ad_ms: row['a-d'] || '',
        ae_ms: row['a-e'] || '',
        ba_ratio: row['b/a'] || '',
        ca_ratio: row['c/a'] || '',
        da_ratio: row['d/a'] || '',
        ea_ratio: row['e/a'] || '',
        pvc: row['맥파전달속도'] || '',
        bv: row['혈액용적'] || '',
        sv: row['1회박출량'] || '',
        hr: row['심박수'] || '',
        symptoms: row['증상'] || '',
        medication: row['복용약물'] || '',
        preference: row['기호식'] || '',
        memo: row['메모'] || ''
      }));
      return mappedData;
    } catch (error) {
      console.error('Excel data processing error:', error);
      return null;
    }
  }, []);
  // readExcelFile 함수 정의 추가
  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = read(data, { type: 'array' });
          resolve(workbook);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };
  // 엑셀 파일 처리 핸들러
  const handleExcelUpload = useCallback(async (file) => {
    try {
      const workbook = await readExcelFile(file);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = utils.sheet_to_json(worksheet);
      console.log('Raw excel data:', rawData);
      const processedData = processExcelData(rawData);
      if (!processedData) {
        throw new Error('데이터 처리 실패');
      }
      // 각 데이터 항목에 대해 저장 실행
      for (const data of processedData) {
        await saveUserInfo(data);
      }
      
      await loadUserData();
      alert('엑셀 데이터가 성공적으로 업로드되었습니다.');
    } catch (error) {
      console.error('Excel upload error:', error);
      alert('엑셀 파일 처리 중 오류가 발생했습니다.');
    }
  }, [processExcelData, loadUserData]);
  // 파일 입력 핸들러
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      handleExcelUpload(file);
    }
  }, [handleExcelUpload]);
  // 데이터 로딩 상태 표시
  if (isLoading) {
    return <div>데이터를 불러오는 중...</div>;
  }
  // 에러 태 표시
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="data-page-container">
      <div className="data-header">
        <h2>로컬 저장 데이터 조회</h2>
        <div className="header-buttons">
          {checkedIds.length > 0 && (
            <button 
              onClick={handleDelete}
              className="delete-button"
            >
              선택한 항목 삭제
            </button>
          )}
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
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="excel-upload"
          />
          <label htmlFor="excel-upload" className="excel-button">
            엑셀 업로드
          </label>
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
            placeholder="주민등록번호 자리"
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
      <div 
        className="table-wrapper" 
        onScroll={handleTableScroll}
        role="region" 
        aria-label="환자 데이터 테블"
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
            총 {getFilteredData().length}개  {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, getFilteredData().length)}개 표시
          </div>
        </div>
        <table 
          className="user-data-table"
          role="grid"
          aria-label="환자 목록"
        >
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={toggleAllCheckboxes}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th>측정일시</th>
              <th>이름</th>
              <th>주민번호</th>
              <th>성별</th>
              <th>성격</th>
              <th>스트레스</th>
              <th>노동강도</th>
              <th>신장(cm)</th>
              <th>체중(kg)</th>
              <th>BMI</th>
              <th>맥박</th>
              <th>수축기혈압</th>
              <th>이완기혈압</th>
              <th>a-b(ms)</th>
              <th>a-c(ms)</th>
              <th>a-d(ms)</th>
              <th>a-e(ms)</th>
              <th>b/a</th>
              <th>c/a</th>
              <th>d/a</th>
              <th>e/a</th>
              <th>PVC</th>
              <th>BV</th>
              <th>SV</th>
              <th>HR</th>
              <th>증상</th>
              <th>복용약물</th>
              <th>기호식</th>
              <th>메모</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredData()
              .slice(visibleRange.start, visibleRange.end)
              .map((user, index) => (
                <tr key={user._id || `row-${index}`} role="row">
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={checkedIds.includes(user._id)}
                      onChange={() => handleCheckboxChange(user._id)}
                      style={{ 
                        width: '18px', 
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{user.name}</td>
                  <td>{user.residentNumber}</td>
                  <td>{user.gender}</td>
                  <td>{user.personality}</td>
                  <td>{user.stress}</td>
                  <td>{user.workIntensity}</td>
                  <td>{user.height}</td>
                  <td>{user.weight}</td>
                  <td>{user.bmi}</td>
                  <td>{user.pulse}</td>
                  <td>{user.systolicBP}</td>
                  <td>{user.diastolicBP}</td>
                  <td>{user.ab_ms}</td>
                  <td>{user.ac_ms}</td>
                  <td>{user.ad_ms}</td>
                  <td>{user.ae_ms}</td>
                  <td>{user.ba_ratio}</td>
                  <td>{user.ca_ratio}</td>
                  <td>{user.da_ratio}</td>
                  <td>{user.ea_ratio}</td>
                  <td>{user.pvc}</td>
                  <td>{user.bv}</td>
                  <td>{user.sv}</td>
                  <td>{user.hr}</td>
                  <td>{Array.isArray(user.symptoms) ? user.symptoms.join(', ') : user.symptoms}</td>
                  <td>{user.medication}</td>
                  <td>{user.preference}</td>
                  <td>{user.memo}</td>
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
      {renderEditModal()}
    </div>
  
  );
};
export default UserDataTable;
