import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const PulseWaveAnalysis = () => {
  const [pulseData, setPulseData] = useState({
    'a-b': '',
    'a-c': '',
    'a-d': '',
    'a-e': '',
    'b/a': '',
    'c/a': '',
    'd/a': '',
    'e/a': ''
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      // 마지막 행의 데이터를 사용 (가장 최근 측정값)
      const lastRow = jsonData[jsonData.length - 1];
      
      setPulseData({
        'a-b': lastRow['a-b(ms)'] || '',
        'a-c': lastRow['a-c(ms)'] || '',
        'a-d': lastRow['a-d(ms)'] || '',
        'a-e': lastRow['a-e(ms)'] || '',
        'b/a': lastRow['b/a'] || '',
        'c/a': lastRow['c/a'] || '',
        'd/a': lastRow['d/a'] || '',
        'e/a': lastRow['e/a'] || ''
      });
    };

    if (file) {
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="pulse-wave-analysis">
      <h2 className="section-title">맥파분석</h2>
      <div className="file-input-container">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="file-input"
        />
      </div>
      <div className="pulse-wave-grid">
        <div className="pulse-wave-input">
          <label>a-b</label>
          <input 
            type="number" 
            name="a-b" 
            value={pulseData['a-b']}
            readOnly
          />
        </div>
        <div className="pulse-wave-input">
          <label>a-c</label>
          <input 
            type="number" 
            name="a-c" 
            value={pulseData['a-c']}
            readOnly
          />
        </div>
        <div className="pulse-wave-input">
          <label>a-d</label>
          <input 
            type="number" 
            name="a-d" 
            value={pulseData['a-d']}
            readOnly
          />
        </div>
        <div className="pulse-wave-input">
          <label>a-e</label>
          <input 
            type="number" 
            name="a-e" 
            value={pulseData['a-e']}
            readOnly
          />
        </div>
        <div className="pulse-wave-input">
          <label>b/a</label>
          <input 
            type="number" 
            name="b/a" 
            value={pulseData['b/a']}
            readOnly
          />
        </div>
        <div className="pulse-wave-input">
          <label>c/a</label>
          <input 
            type="number" 
            name="c/a" 
            value={pulseData['c/a']}
            readOnly
          />
        </div>
        <div className="pulse-wave-input">
          <label>d/a</label>
          <input 
            type="number" 
            name="d/a" 
            value={pulseData['d/a']}
            readOnly
          />
        </div>
        <div className="pulse-wave-input">
          <label>e/a</label>
          <input 
            type="number" 
            name="e/a" 
            value={pulseData['e/a']}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default PulseWaveAnalysis; 