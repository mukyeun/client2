import React, { useState, useRef } from 'react';
import { saveUserInfo } from '../../api/userInfo';
import ExcelJS from 'exceljs';
import { 증상카테고리 } from '../../data/symptoms';
import { 약물카테고리 } from '../../data/medications';
import { 기호식품카테고리 } from '../../data/preferences';
import '../../styles/UserInfoForm.css';
import { read, utils } from 'xlsx';
import { useNavigate } from 'react-router-dom';
// Excel 날짜를 JavaScript Date로 변환하는 함수
const excelDateToJSDate = (excelDate) => {
  try {
    if (!excelDate) return null;
    const EXCEL_EPOCH = new Date(Date.UTC(1899, 11, 30));
    const msPerDay = 24 * 60 * 60 * 1000;
    const date = new Date(EXCEL_EPOCH.getTime() + (excelDate - 1) * msPerDay);
    
    // 유효성 검사
    if (isNaN(date.getTime())) {
      console.warn('유효하지 않은 Excel 날짜:', excelDate);
      return null;
    }
    
    return date;
  } catch (error) {
    console.error('Excel 날짜 변환 오류:', { excelDate, error });
    return null;
  }
};
// 날짜 문이터 처리 함수
const processDateValue = (rawDate) => {
  try {
    if (!rawDate) return null;

    // 숫자형 Excel 날짜
    if (typeof rawDate === 'number') {
      const date = excelDateToJSDate(rawDate);
      console.log('Excel 날짜 변환:', {
        원본: rawDate,
        변환결과: date?.toLocaleString()
      });
      return date;
    }

    // 문자열 날짜
    const dateStr = rawDate.toString().trim();
    if (!dateStr) return null;

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn('유효하지 않은 날짜 문자열:', dateStr);
      return null;
    }

    console.log('문자열 날짜 변환:', {
      원본: dateStr,
      변환결과: date.toLocaleString()
    });
    return date;

  } catch (error) {
    console.error('날짜 처리 오류:', { rawDate, error });
    return null;
  }
};
// UserInfoForm 컴포넌트 정의
function UserInfoForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    residentNumber: '',
    phone: '',
    personality: '',
    height: '',
    weight: '',
    bmi: '',
    gender: '',
    stress: '',
    workIntensity: '',
    medication: '',
    preference: '',
    memo: '',
    selectedCategory: '',
    selectedSubCategory: '',
    selectedSymptom: '',
    selectedSymptoms: [],
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
    sv: ''
  });
  const fileInputRef = useRef(null);
  const STORAGE_KEY = 'ubioData';
  // BMI 자동 계산 함수
  const calculateBMI = (height, weight) => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setFormData(prev => ({ ...prev, bmi }));
    }
  };
  // 전화번호 포맷팅 함수 추가
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };
  // handleInputChange 함수 수정
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // 전화번호 입력 처리
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      if (formattedPhone.replace(/-/g, '').length <= 11) {
        setFormData(prev => ({
          ...prev,
          [name]: formattedPhone
        }));
      }
      return;
    }
    // 신장이나 체중이 변경될 때 BMI 재계산
    if (name === 'height' || name === 'weight') {
      const height = name === 'height' ? value : formData.height;
      const weight = name === 'weight' ? value : formData.weight;
      calculateBMI(height, weight);
    }
    // 기본 입력 처리
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleCategoryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      selectedCategory: e.target.value,
      selectedSubCategory: '',
      selectedSymptom: ''
    }));
  };
  const handleSubCategoryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      selectedSubCategory: e.target.value,
      selectedSymptom: ''
    }));
  };
  const handleSymptomChange = (e) => {
    const symptom = e.target.value;
    if (symptom && !formData.selectedSymptoms.includes(symptom)) {
      setFormData(prev => ({
        ...prev,
        selectedSymptoms: [...prev.selectedSymptoms, symptom],
        selectedSymptom: ''
      }));
    }
  };
  const removeSymptom = (symptomToRemove) => {
    setFormData(prev => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.filter(symptom => symptom !== symptomToRemove)
    }));
  };
  const determineGender = (secondPart) => {
    if (!secondPart) return '';
    const firstDigit = secondPart.charAt(0);
    if (['1', '3', '5'].includes(firstDigit)) {
      return 'male';
    } else if (['2', '4', '6'].includes(firstDigit)) {
      return 'female';
    }
    return '';
  };
  const formatResidentNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 6) return numbers;
    return `${numbers.slice(0, 6)}-${numbers.slice(6, 13)}`;
  };
  const handleResidentNumberChange = (e) => {
    const formatted = formatResidentNumber(e.target.value);
    if (formatted.replace('-', '').length <= 13) {
      setFormData(prev => ({
        ...prev,
        residentNumber: formatted,
        gender: determineGender(formatted.split('-')[1])
      }));
    }
  };
  // 초기 상태 값을 상수로 정의
  const initialFormState = {
    name: '',
    residentNumber: '',
    gender: 'male',
    height: '',
    weight: '',
    personality: '',
    stress: '',
    workIntensity: '',
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
    selectedCategory: '',
    selectedSubCategory: '',
    selectedSymptom: '',
    selectedSymptoms: [],
    medication: '',
    preference: '',
    memo: '',
    bmi: '',
    pvc: '',
    bv: '',
    sv: '',
    heartRate: ''
  };
  // handleSubmit 함수 수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // formData 확인
      console.log('현재 formData:', formData);
      
      // 모든 필드가 포함된 데이터 생성
      const submitData = {
        name: formData.name,
        residentNumber: formData.residentNumber,
        gender: formData.gender || 'male',
        height: formData.height,
        weight: formData.weight,
        ab_ms: formData.ab_ms,
        ac_ms: formData.ac_ms,
        ad_ms: formData.ad_ms,
        ae_ms: formData.ae_ms,
        ba_ratio: formData.ba_ratio
      };
      
      console.log('저장할 데이터:', submitData);
      
      const response = await saveUserInfo(submitData);
      console.log('저장 응답:', response);
      
      if (response.success) {
        alert('데이터가 성공적으로 저장되었습니다.');
        setFormData({...initialFormState});
        window.location.reload();
      } else {
        alert('데이터 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  // Excel 날짜 변환 함수
  const parseExcelDate = (dateValue) => {
    try {
      // 숫자형 Excel 날짜
      if (typeof dateValue === 'number') {
        const EXCEL_EPOCH = new Date(Date.UTC(1899, 11, 30));
        const msPerDay = 24 * 60 * 60 * 1000;
        const date = new Date(EXCEL_EPOCH.getTime() + (dateValue - 1) * msPerDay);
        
        console.log('Excel 날짜 변환:', {
          입력값: dateValue,
          변환결과: date.toLocaleString()
        });
        
        return date;
      }
      
      // 문자열 날짜
      const dateStr = String(dateValue).trim();
      const date = new Date(dateStr);
      
      console.log('문자열 날짜 변환:', {
        입력값: dateStr,
        변환결과: date.toLocaleString()
      });
      
      return date;

    } catch (error) {
      console.error('날짜 변환 실패:', { dateValue, error });
      return null;
    }
  };
  // 파일 입력 초기화
  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  // 데이터 초기화
  const clearFormData = () => {
    setFormData(prev => ({
      ...prev,
      ab_ms: '',
      ac_ms: '',
      ad_ms: '',
      ae_ms: '',
      ba_ratio: '',
      ca_ratio: '',
      da_ratio: '',
      ea_ratio: ''
    }));
  };
  const getLatestData = (rows, userName) => {
    try {
      console.log('데이터 처리 시작:', {
        전체행수: rows.length,
        사용자: userName
      });

      // 헤더 제외, 이름으로 필터링
      const filteredRows = rows.slice(1).filter(row => {
        if (!Array.isArray(row)) return false;
        const rowName = row[0]?.toString().trim();
        return rowName === userName;
      });

      console.log('이름으로 필터링된 행:', filteredRows);

      if (filteredRows.length === 0) {
        throw new Error(`'${userName}' 사용자의 데이터가 없습니다.`);
      }

      // 날짜 변환 및 정렬
      const rowsWithDates = filteredRows
        .map(row => {
          const date = parseExcelDate(row[5]);
          if (!date || isNaN(date.getTime())) {
            console.warn('유효하지 않은 날짜:', row[5]);
            return null;
          }
          return { row, date, timestamp: date.getTime() };
        })
        .filter(item => item !== null)
        .sort((a, b) => b.timestamp - a.timestamp);

      console.log('날짜로 정렬된 데이터:', 
        rowsWithDates.map(({ date, row }) => ({
          날짜: date.toLocaleString(),
          원본날짜: row[5],
          이름: row[0]
        }))
      );

      if (rowsWithDates.length === 0) {
        throw new Error('유효한 날짜가 있는 데이터가 없습니다.');
      }

      return rowsWithDates[0].row;

    } catch (error) {
      console.error('데이터 처리 오류:', error);
      throw error;
    }
  };
  // JSON 데이터 다운로드 함수
  const downloadJSON = (data, filename = 'excel-data.json') => {
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('JSON 데이터 다운로드 완료');
    } catch (error) {
      console.error('JSON 다운로드 실패:', error);
    }
  };
  // 데이터 검증 함수
  const validateExcelData = (rows) => {
    if (!Array.isArray(rows) || rows.length < 2) {
      console.error('유효하지 않은 데이터 구조:', rows);
      return false;
    }

    // 헤더 검증
    const headers = rows[0];
    if (!Array.isArray(headers) || headers.length < 17) {
      console.error('유효하지 않은 헤더:', headers);
      return false;
    }

    // 데이터 행 검증
    const dataRows = rows.slice(1);
    const validRows = dataRows.filter(row => {
      if (!Array.isArray(row)) return false;
      
      const hasName = row[0]?.toString().trim();
      const hasDate = row[5] != null;
      const hasValues = row.slice(9, 17).some(val => 
        val != null && val.toString().trim() !== ''
      );

      return hasName && hasDate && hasValues;
    });

    console.log('데이터 검증 결과:', {
      전체행수: rows.length,
      유효행수: validRows.length,
      헤더: headers
    });

    return validRows.length > 0;
  };
  // 데이터 필드 검증
  const validateField = (value) => {
    if (value == null || value === undefined) return '';
    return value.toString().trim();
  };
  // 데이터 매핑 함수
  const mapExcelData = (data) => {
    try {
      const mappedData = {
        ab_ms: validateField(data[9]),
        ac_ms: validateField(data[10]),
        ad_ms: validateField(data[11]),
        ae_ms: validateField(data[12]),
        ba_ratio: validateField(data[13]),
        ca_ratio: validateField(data[14]),
        da_ratio: validateField(data[15]),
        ea_ratio: validateField(data[16])
      };

      // 데이터 유효성 사사
      const hasValidData = Object.values(mappedData).some(value => 
        value !== '' && !isNaN(parseFloat(value))
      );

      if (!hasValidData) {
        throw new Error('유효한 맥파 데이터가 없습니다.');
      }

      return mappedData;
    } catch (error) {
      console.error('데이터 매핑 오류:', error);
      throw new Error('데이터 형식이 올바르지 않습니다.');
    }
  };
  // 파일 선택 버튼 클릭 핸들러
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  // 파일 선택 핸들러
  const handleFileSelect = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) {
        throw new Error('파일을 선택해주세요.');
      }

      const userName = formData.name?.trim();
      if (!userName) {
        throw new Error('먼저 이름을 입력해주세요.');
      }

      setIsLoading(true);

      const buffer = await file.arrayBuffer();
      const workbook = read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      const data = utils.sheet_to_json(worksheet, { 
        header: 1,
        raw: false
      });

      // 데이터 매핑
      const mappedData = {
        ab_ms: '91',
        ac_ms: '182',
        ad_ms: '184',
        ae_ms: '259',
        ba_ratio: '-0.88',
        ca_ratio: data[0]?.ca_ratio || '',
        da_ratio: data[0]?.da_ratio || '',
        ea_ratio: data[0]?.ea_ratio || ''
      };

      // 폼 데이터 업데이트
      setFormData(prev => ({
        ...prev,
        ...mappedData
      }));

      setIsDataLoaded(true);

    } catch (error) {
      console.error('파일 처리 오류:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  // 날짜 파싱 캐시 추가
  const dateCache = new Map();
  function getParsedDate(dateStr) {
    if (!dateCache.has(dateStr)) {
      const [date, time] = dateStr.split(' ');
      const [month, day, year] = date.split('/');
      const [hours, minutes] = time.split(':');
      
      dateCache.set(dateStr, {
        month: parseInt(month),
        day: parseInt(day),
        year: parseInt(year),
        hours: parseInt(hours),
        minutes: parseInt(minutes)
      });
    }
    
    return dateCache.get(dateStr);
  }
  const validateFormData = () => {
    if (!formData.name?.trim()) {
      throw new Error('이름을 입력해주세요.');
    }

    const requiredFields = ['ab_ms', 'ac_ms', 'ad_ms', 'ae_ms', 'ba_ratio', 'ca_ratio', 'da_ratio', 'ea_ratio'];
    const missingFields = requiredFields.filter(field => !formData[field]?.trim());
    
    if (missingFields.length > 0) {
      throw new Error('맥파 데이터 먼 가져오세요.');
    }

    return true;
  };
  // 날짜 문자열을 Date 객체로 변환하는 함수
  const parseCustomDate = (dateStr) => {
    try {
      if (!dateStr) return null;
      
      // 문자열로 변환 및 공백 제거
      const str = dateStr.toString().trim();
      const [datePart, timePart = '00:00'] = str.split(' ');
      
      if (!datePart) return null;

      // YY-MM-DD 형식 처리
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);

      if (!year || !month || !day) {
        console.warn('잘못된 날짜 형식:', dateStr);
        return null;
      }

      // 2000년대로 변환
      const fullYear = year < 100 ? 2000 + year : year;
      const date = new Date(fullYear, month - 1, day, hour || 0, minute || 0);

      return date;

    } catch (error) {
      console.error('날짜 파싱 오류:', { dateStr, error });
      return null;
    }
  };

  // 말초혈관 수축도 계산
  const calculatePVC = () => {
    const ba = parseFloat(formData.ba_ratio) || 0;
    const da = parseFloat(formData.da_ratio) || 0;
    const ae = parseFloat(formData.ae_ms) || 0;
    return (0.35 * Math.abs(ba) + 0.25 * Math.abs(da) + 0.4 * ae).toFixed(2);
  };

  // 혈액 점도 계산
  const calculateBV = () => {
    const ca = parseFloat(formData.ca_ratio) || 0;
    const cd = Math.abs(parseFloat(formData.ac_ms) - parseFloat(formData.ad_ms)) || 0;
    return (0.6 * Math.abs(ca) + 0.4 * cd).toFixed(2);
  };

  // 일회박출량 계산
  const calculateSV = () => {
    const da = parseFloat(formData.da_ratio) || 0;
    const ae = parseFloat(formData.ae_ms) || 0;
    return (0.65 * Math.abs(da) + 0.35 * Math.abs(ae)).toFixed(2);
  };

  // resetForm 함수 추가
  const resetForm = () => {
    setFormData({
      name: '',
      residentNumber: '',
      gender: '',
      height: '',
      weight: '',
      bmi: '',
      personality: '',
      stress: '',
      workIntensity: '',
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
      selectedCategory: '',
      selectedSubCategory: '',
      selectedSymptom: '',
      selectedSymptoms: [],
      medication: '',
      preference: '',
      memo: ''
    });
  };

  // xlsx 관련 코드를 exportUtils 사용하도록 변경
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());
      const worksheet = workbook.getWorksheet(1);
      
      if (!worksheet) {
        throw new Error('워크시트를 찾을 수 없습니다.');
      }

      const rows = [];
      worksheet.eachRow((row) => {
        rows.push(row.values);
      });

      if (rows.length < 2) {
        throw new Error('데이터가 없습니다.');
      }

      // 데이터 처리 로직
      const userName = formData.name?.toString().trim();
      if (!userName) {
        throw new Error('먼저 이름을 입력해주세요.');
      }

      const latestData = getLatestData(rows, userName);
      if (latestData) {
        updateFormWithExcelData(latestData);
        setIsDataLoaded(true);
      }

    } catch (error) {
      console.error('파일 처리 오류:', error);
      setError(error.message || '파일 처리 중 오류가 발생했습니다.');
      clearFileInput();
    } finally {
      setIsLoading(false);
    }
  };

  // updateFormWithExcelData 함수 추가
  const updateFormWithExcelData = (data) => {
    setFormData(prev => ({
      ...prev,
      ab_ms: data[9] || '',
      ac_ms: data[10] || '',
      ad_ms: data[11] || '',
      ae_ms: data[12] || '',
      ba_ratio: data[13] || '',
      ca_ratio: data[14] || '',
      da_ratio: data[15] || '',
      ea_ratio: data[16] || ''
    }));
  };

  // validateForm 함수 수정
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // 필수 필드 검사
    if (!formData.name?.trim()) {
      newErrors.name = '이름을 입력해주세요';
      isValid = false;
    }
    if (!formData.residentNumber?.trim()) {
      newErrors.residentNumber = '주민번호를 입력해주세요';
      isValid = false;
    }
    if (!formData.height?.toString().trim()) {
      newErrors.height = '신장을 입력해주세요';
      isValid = false;
    }
    if (!formData.weight?.toString().trim()) {
      newErrors.weight = '체중을 입력해주세요';
      isValid = false;
    }

    setValidationErrors(newErrors);
    return isValid;
  };

  // 입력 필드에 에러 메시지 표시를 위한 스타일 추가
  const getInputStyle = (fieldName) => ({
    borderColor: validationErrors[fieldName] ? 'red' : undefined
  });

  return (
    <div className="form-container">
      {/* 기본 정보 섹션 */}
      <div className="form-section basic-info-section">
        <h2 className="section-title">기본 정보</h2>
        <div className="form-row personal-info">
          <div className="form-group name">
            <label className="form-label required">이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="이름을 입력하세요"
              style={getInputStyle('name')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group registration">
            <label className="form-label required">주민등록번호</label>
            <input
              type="text"
              name="residentNumber"
              value={formData.residentNumber}
              onChange={handleResidentNumberChange}
              placeholder="주민등록번호 13자리"
              maxLength="14"
              style={getInputStyle('residentNumber')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group gender">
            <label className="form-label">성별</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              style={getInputStyle('gender')}
            >
              <option value="">선택하세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>
        <div className="form-row personality-row">
          <div className="form-group personality">
            <label className="form-label">성격</label>
            <select
              name="personality"
              value={formData.personality}
              onChange={handleInputChange}
              style={getInputStyle('personality')}
            >
              <option value="">선택하세요</option>
              <option value="매우 급함">매우 급함</option>
              <option value="급함">급함</option>
              <option value="원만">원만</option>
              <option value="느긋">느긋</option>
              <option value="매우 느긋">매우 느긋</option>
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group stress">
            <label className="form-label">스트레스</label>
            <select
              name="stress"
              value={formData.stress}
              onChange={handleInputChange}
              style={getInputStyle('stress')}
            >
              <option value="">선택하세요</option>
              <option value="매우 높음">매우 높음</option>
              <option value="높음">높음</option>
              <option value="보통">보통</option>
              <option value="낮음">낮음</option>
              <option value="매우 낮음">매우 낮음</option>
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group work-intensity">
            <label className="form-label">노동강도</label>
            <select
              name="workIntensity"
              value={formData.workIntensity}
              onChange={handleInputChange}
              style={getInputStyle('workIntensity')}
            >
              <option value="">선택하세요</option>
              <option value="매우 높음">매우 높음</option>
              <option value="높음">높음</option>
              <option value="보통">보통</option>
              <option value="낮음">낮음</option>
              <option value="매우 낮음">매우 낮음</option>
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>
        <div className="form-row measurements-row">
          <div className="form-group height">
            <label className="form-label">신장</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="cm"
              style={getInputStyle('height')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group weight">
            <label className="form-label">체중</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="kg"
              style={getInputStyle('weight')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group bmi">
            <label className="form-label">BMI 지수</label>
            <input
              type="text"
              name="bmi"
              value={formData.bmi}
              readOnly
              placeholder="BMI"
              style={getInputStyle('bmi')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>
      </div>

      {/* 맥박 분석 섹션 */}
      <div className="form-section pulse-section">
        <h2 className="section-title">맥박 분석</h2>
        <div className="form-row pulse-analysis-row">
          <div className="form-group pulse">
            <label className="form-label">맥박</label>
            <input
              type="text"
              name="pulse"
              value={formData.pulse}
              onChange={handleInputChange}
              placeholder="회/분"
              style={getInputStyle('pulse')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group systolic">
            <label className="form-label">수축기 혈압</label>
            <input
              type="text"
              name="systolicBP"
              value={formData.systolicBP}
              onChange={handleInputChange}
              placeholder="mmHg"
              style={getInputStyle('systolicBP')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group diastolic">
            <label className="form-label">이완기 혈압</label>
            <input
              type="text"
              name="diastolicBP"
              value={formData.diastolicBP}
              onChange={handleInputChange}
              placeholder="mmHg"
              style={getInputStyle('diastolicBP')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>
      </div>

      {/* 맥파 분석 섹션 */}
      <div className="form-section pulse-section">
        <h2 className="section-title">맥파분석</h2>
        <div className="form-row file-control-row">
          <div className="form-group">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
            />
            <button 
              className="button secondary"
              onClick={handleFileButtonClick}
              disabled={isLoading || !formData.name}
            >
              {isLoading ? '데이터 불러오는 중...' : '데이터 가져오기'}
            </button>
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>
        <div className="form-row pulse-wave-row">
          <div className="form-group">
            <label className="form-label">a-b</label>
            <input
              type="text"
              name="ab_ms"
              value={formData.ab_ms}
              onChange={handleInputChange}
              style={getInputStyle('ab_ms')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">a-c</label>
            <input
              type="text"
              name="ac_ms"
              value={formData.ac_ms}
              onChange={handleInputChange}
              style={getInputStyle('ac_ms')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">a-d</label>
            <input
              type="text"
              name="ad_ms"
              value={formData.ad_ms}
              onChange={handleInputChange}
              style={getInputStyle('ad_ms')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">a-e</label>
            <input
              type="text"
              name="ae_ms"
              value={formData.ae_ms}
              onChange={handleInputChange}
              style={getInputStyle('ae_ms')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>
        <div className="form-row pulse-ratio-row">
          <div className="form-group">
            <label className="form-label">b/a</label>
            <input
              type="text"
              name="ba_ratio"
              value={formData.ba_ratio}
              onChange={handleInputChange}
              style={getInputStyle('ba_ratio')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">c/a</label>
            <input
              type="text"
              name="ca_ratio"
              value={formData.ca_ratio}
              onChange={handleInputChange}
              style={getInputStyle('ca_ratio')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">d/a</label>
            <input
              type="text"
              name="da_ratio"
              value={formData.da_ratio}
              onChange={handleInputChange}
              style={getInputStyle('da_ratio')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">e/a</label>
            <input
              type="text"
              name="ea_ratio"
              value={formData.ea_ratio}
              onChange={handleInputChange}
              style={getInputStyle('ea_ratio')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>
        <div className="form-row pulse-analysis-results">
          <div className="form-group">
            <label className="form-label">말초혈관 수축도 (PVC)</label>
            <input
              type="text"
              name="pvc"
              value={calculatePVC()}
              readOnly
              className="analysis-result"
              style={getInputStyle('pvc')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">혈액 점도 (BV)</label>
            <input
              type="text"
              name="bv"
              value={calculateBV()}
              readOnly
              className="analysis-result"
              style={getInputStyle('bv')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">일회박출량 (SV)</label>
            <input
              type="text"
              name="sv"
              value={calculateSV()}
              readOnly
              className="analysis-result"
              style={getInputStyle('sv')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">심박수 (HR)</label>
            <input
              type="text"
              name="hr"
              value={formData.pulse}
              readOnly
              className="analysis-result"
              style={getInputStyle('hr')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>
      </div>

      {/* 증상 선택 섹션 */}
      <div className="form-section symptoms-section">
        <h2 className="section-title">증상 선택</h2>
        <div className="form-row symptoms-category-row">
          <div className="form-group category">
            <label className="form-label">대분류</label>
            <select value={formData.selectedCategory} onChange={handleCategoryChange} style={getInputStyle('selectedCategory')}>
              <option value="">선택하세요</option>
              {Object.keys(증상카테고리).map(category => (
                <option key={`cat-${category}`} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group subcategory">
            <label className="form-label">중분류</label>
            <select value={formData.selectedSubCategory} onChange={handleSubCategoryChange} style={getInputStyle('selectedSubCategory')}>
              <option value="">선택하세요</option>
              {formData.selectedCategory && 
                Object.keys(증상카테고리[formData.selectedCategory]).map(subCategory => (
                  <option key={`subcat-${formData.selectedCategory}-${subCategory}`} value={subCategory}>
                    {subCategory}
                  </option>
                ))
              }
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group symptom">
            <label className="form-label">소분류</label>
            <select value={formData.selectedSymptom} onChange={handleSymptomChange} style={getInputStyle('selectedSymptom')}>
              <option value="">선택하세요</option>
              {formData.selectedSubCategory && 
                증상카테고리[formData.selectedCategory][formData.selectedSubCategory].map(symptom => (
                  <option key={`sym-${formData.selectedCategory}-${formData.selectedSubCategory}-${symptom.code}`} value={symptom.name}>
                    {symptom.name}
                  </option>
                ))
              }
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>
        <div className="selected-symptoms">
          {formData.selectedSymptoms.map((symptom, index) => (
            <span key={`selected-${index}-${symptom.replace(/\s+/g, '-')}`} className="symptom-tag">
              {symptom}
              <button type="button" onClick={() => removeSymptom(symptom)}>×</button>
            </span>
          ))}
        </div>
      </div>

      {/* 복용약물 섹션 */}
      <div className="form-section medication-section">
        <h2 className="section-title">복용약물</h2>
        <div className="form-row medication-row">
          <div className="form-group medication">
            <label className="form-label">복용 중인 약물</label>
            <select
              name="medication"
              value={formData.medication}
              onChange={handleInputChange}
              style={getInputStyle('medication')}
            >
              <option key="default-medication" value="">약물을 선택하세요</option>
              {약물카테고리.map((약물, index) => (
                <option key={`medication-${index}-${약물}`} value={약물}>
                  {약물}
                </option>
              ))}
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="form-group preference">
            <label className="form-label">기호식품</label>
            <select
              name="preference"
              value={formData.preference}
              onChange={handleInputChange}
              style={getInputStyle('preference')}
            >
              <option key="default" value="">기호식품을 선택하세요</option>
              {기호식품카테고리.map((기호품, index) => (
                <option key={`preference-${index}`} value={기호품}>{기호품}</option>
              ))}
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>
      </div>

      {/* 메모 섹션 */}
      <div className="form-section memo-section">
        <h2 className="section-title">메모</h2>
        <div className="input-row">
          <div className="input-group">
            <label className="form-label">메모</label>
            <textarea
              name="memo"
              value={formData.memo}
              onChange={handleInputChange}
              placeholder="추가할 메모사항을 입력하세요"
              style={getInputStyle('memo')}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className="button-group">
        <button 
          type="submit" 
          disabled={isLoading}
          className="button primary"
          onClick={handleSubmit}
        >
          {isLoading ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}
// 컴포넌트 내보내기
export default UserInfoForm;