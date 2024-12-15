import React, { useState } from 'react';

const PulseAnalysis = () => {
  const [pulseData, setPulseData] = useState({
    pulse: '',
    systolic: '',
    diastolic: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPulseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="input-container">
      <h2 className="section-title">맥박 분석</h2>
      <div className="input-group">
        <div className="pulse-input">
          <label className="field-label">맥박</label>
          <input 
            type="text"
            name="pulse"
            value={pulseData.pulse}
            onChange={handleChange}
            placeholder="회/분"
          />
        </div>
        <div className="pulse-input">
          <label className="field-label">수축기 혈압</label>
          <div className="input-with-unit">
            <input 
              type="text"
              name="systolic"
              value={pulseData.systolic}
              onChange={handleChange}
              placeholder="수축기 혈압"
            />
            <span className="unit">mmHg</span>
          </div>
        </div>
        <div className="pulse-input">
          <label className="field-label">이완기 혈압</label>
          <div className="input-with-unit">
            <input 
              type="text"
              name="diastolic"
              value={pulseData.diastolic}
              onChange={handleChange}
              placeholder="이완기 혈압"
            />
            <span className="unit">mmHg</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PulseAnalysis; 