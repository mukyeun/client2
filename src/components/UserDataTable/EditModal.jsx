import React, { useState } from 'react';
import './EditModal.css';

const EditModal = ({ user, onClose, onSave }) => {
  // 초기 상태를 빈 객체로 설정
  const initialState = {
    name: '',
    residentNumber: '',
    gender: '',
    personality: '',
    stress: '',
    workIntensity: '',
    height: '',
    weight: '',
    bmi: '',
    pulse: '',
    systolicBP: '',
    diastolicBP: '',
    ab_ms: '',
    ac_ms: '',
    ad_ms: '',
    ae_ms: '',
    ba_ratio: '',
    ca_ratio: '',
    da_ratio: '',
    ea_ratio: '',
    pvc: '',
    bv: '',
    sv: '',
    hr: '',
    symptoms: '',
    medication: '',
    preference: '',
    memo: '',
    ...user // 기존 사용자 데이터가 있으면 덮어쓰기
  };

  const [editedUser, setEditedUser] = useState(initialState);

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
          <div className="form-section">
            <h3>기본 정보</h3>
            <div className="form-group">
              <label>이름</label>
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>주민등록번호</label>
              <input
                type="text"
                value={editedUser.residentNumber}
                onChange={(e) => handleChange('residentNumber', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>성별</label>
              <select
                value={editedUser.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <option value="">선택하세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>신체 정보</h3>
            <div className="form-group">
              <label>신장(cm)</label>
              <input
                type="number"
                value={editedUser.height}
                onChange={(e) => handleChange('height', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>체중(kg)</label>
              <input
                type="number"
                value={editedUser.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>BMI</label>
              <input
                type="number"
                value={editedUser.bmi}
                onChange={(e) => handleChange('bmi', e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>맥파 분석 데이터</h3>
            <div className="form-group">
              <label>맥박</label>
              <input
                type="number"
                value={editedUser.pulse}
                onChange={(e) => handleChange('pulse', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>수축기 혈압</label>
              <input
                type="number"
                value={editedUser.systolicBP}
                onChange={(e) => handleChange('systolicBP', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>이완기 혈압</label>
              <input
                type="number"
                value={editedUser.diastolicBP}
                onChange={(e) => handleChange('diastolicBP', e.target.value)}
              />
            </div>

            {/* 맥파 시간 간격 */}
            <div className="form-group">
              <label>a-b(ms)</label>
              <input
                type="number"
                value={editedUser.ab_ms}
                onChange={(e) => handleChange('ab_ms', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>a-c(ms)</label>
              <input
                type="number"
                value={editedUser.ac_ms}
                onChange={(e) => handleChange('ac_ms', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>a-d(ms)</label>
              <input
                type="number"
                value={editedUser.ad_ms}
                onChange={(e) => handleChange('ad_ms', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>a-e(ms)</label>
              <input
                type="number"
                value={editedUser.ae_ms}
                onChange={(e) => handleChange('ae_ms', e.target.value)}
              />
            </div>

            {/* 맥파 비율 */}
            <div className="form-group">
              <label>b/a</label>
              <input
                type="number"
                value={editedUser.ba_ratio}
                onChange={(e) => handleChange('ba_ratio', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>c/a</label>
              <input
                type="number"
                value={editedUser.ca_ratio}
                onChange={(e) => handleChange('ca_ratio', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>d/a</label>
              <input
                type="number"
                value={editedUser.da_ratio}
                onChange={(e) => handleChange('da_ratio', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>e/a</label>
              <input
                type="number"
                value={editedUser.ea_ratio}
                onChange={(e) => handleChange('ea_ratio', e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>추가 정보</h3>
            <div className="form-group">
              <label>증상</label>
              <input
                type="text"
                value={editedUser.symptoms}
                onChange={(e) => handleChange('symptoms', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>복용약물</label>
              <input
                type="text"
                value={editedUser.medication}
                onChange={(e) => handleChange('medication', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>기호식</label>
              <input
                type="text"
                value={editedUser.preference}
                onChange={(e) => handleChange('preference', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>메모</label>
              <textarea
                value={editedUser.memo}
                onChange={(e) => handleChange('memo', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="save-button">저장</button>
            <button type="button" onClick={onClose} className="cancel-button">취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal; 