import React from 'react';
import '../../styles/UserInfoTable.css';

const UserInfoTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="empty-message">저장된 데이터가 없습니다.</div>;
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>등록일시</th>
            <th>이름</th>
            <th>연락처</th>
            <th>성별</th>
            <th>맥박</th>
            <th>혈압</th>
            <th>증상</th>
            <th>복용약물</th>
            <th>기호식품</th>
            <th>메모</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.registrationDate}</td>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{item.gender}</td>
              <td>{item.pulse}</td>
              <td>{`${item.systolicBP}/${item.diastolicBP}`}</td>
              <td>{item.symptoms?.join(', ')}</td>
              <td>{item.medication}</td>
              <td>{item.preference}</td>
              <td>{item.memo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserInfoTable;