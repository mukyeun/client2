import React, { useState } from 'react';
import './EditModal.css';

const EditModal = ({ user, onClose, onSave }) => {
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedUser);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>데이터 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              value={editedUser.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>주민등록번호</label>
            <input
              type="text"
              value={editedUser.residentNumber || ''}
              onChange={(e) => handleChange('residentNumber', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>성별</label>
            <select
              value={editedUser.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>

          <div className="form-group">
            <label>신장(cm)</label>
            <input
              type="number"
              value={editedUser.height || ''}
              onChange={(e) => handleChange('height', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>체중(kg)</label>
            <input
              type="number"
              value={editedUser.weight || ''}
              onChange={(e) => handleChange('weight', e.target.value)}
            />
          </div>

          {/* 다른 필드들도 같은 방식으로 추가 */}

          <div className="modal-buttons">
            <button type="submit" className="save-button">
              저장
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal; 