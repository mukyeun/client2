import React, { useState, useEffect } from 'react';
import { getAllUserInfo } from '../../api/userInfo';
import { exportToExcel } from '../../utils/excelExport';
import UserInfoTable from '../../components/UserInfoTable';
import '../../styles/UserDataView.css';

const UserDataView = () => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUserInfo();
      if (response.success) {
        setUserData(response.data);
      }
    } catch (error) {
      alert('데이터 로드 중 오류가 발생했습니다.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleExportExcel = async () => {
    try {
      exportToExcel(userData);
      alert('엑셀 파일이 생성되었습니다.');
    } catch (error) {
      alert('엑셀 파일 생성 중 오류가 발생했습니다.');
    }
  };

  const handleRefresh = () => {
    loadUserData();
  };

  return (
    <div className="view-container">
      <div className="header">
        <h2 className="title">환자 데이터 조회</h2>
        <div className="button-group">
          <button className="button secondary" onClick={handleRefresh}>
            새로고침
          </button>
          <button className="button primary" onClick={handleExportExcel}>
            엑셀 다운로드
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div>데이터를 불러오는 중...</div>
      ) : (
        <UserInfoTable data={userData} />
      )}
    </div>
  );
};

export default UserDataView; 