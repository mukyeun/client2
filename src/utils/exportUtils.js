import * as XLSX from 'xlsx';

// 엑셀 내보내기
export const exportToExcel = (data, fileName = 'user-info.xlsx') => {
  const processedData = data.map(item => ({
    이름: item.name,
    연락처: item.phone,
    주민등록번호: item.residentNumber,
    성별: item.gender === 'male' ? '남성' : '여성',
    키: item.height,
    체중: item.weight,
    BMI: item.bmi,
    맥박: item.pulse,
    수축기혈압: item.systolicBP,
    이완기혈압: item.diastolicBP,
    'a-b(ms)': item.ab_ms,
    'a-c(ms)': item.ac_ms,
    'a-d(ms)': item.ad_ms,
    'a-e(ms)': item.ae_ms,
    'b/a': item.ba_ratio,
    'c/a': item.ca_ratio,
    'd/a': item.da_ratio,
    'e/a': item.ea_ratio,
    'PVC': item.pvc,
    'BV': item.bv,
    'SV': item.sv,
    'HR': item.hr,
    성격: item.personality,
    스트레스: item.stress,
    업무강도: item.workIntensity,
    증상: Array.isArray(item.selectedSymptoms) ? item.selectedSymptoms.join(', ') : item.selectedSymptoms || '',
    복용약물: item.medication,
    기호식품: item.preference,
    메모: item.memo,
    등록일시: item.createdAt ? new Date(item.createdAt).toLocaleString() : ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'UserInfo');
  
  const today = new Date().toISOString().split('T')[0];
  const finalFileName = fileName.replace('.xlsx', `-${today}.xlsx`);
  
  XLSX.writeFile(workbook, finalFileName);
};

// 엑셀 가져오기
export const importFromExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // 데이터 형식 변환
        const processedData = jsonData.map(row => ({
          name: row['이름'],
          phone: row['연락처'],
          residentNumber: row['주민등록번호'],
          gender: row['성별'] === '남성' ? 'male' : 'female',
          height: row['키'],
          weight: row['체중'],
          bmi: row['BMI'],
          pulse: row['맥박'],
          systolicBP: row['수축기혈압'],
          diastolicBP: row['이완기혈압'],
          ab_ms: row['a-b(ms)'],
          ac_ms: row['a-c(ms)'],
          ad_ms: row['a-d(ms)'],
          ae_ms: row['a-e(ms)'],
          ba_ratio: row['b/a'],
          ca_ratio: row['c/a'],
          da_ratio: row['d/a'],
          ea_ratio: row['e/a'],
          pvc: row['PVC'],
          bv: row['BV'],
          sv: row['SV'],
          hr: row['HR'],
          personality: row['성격'],
          stress: row['스트레스'],
          workIntensity: row['업무강도'],
          selectedSymptoms: row['증상'] ? row['증상'].split(', ') : [],
          medication: row['복용약물'],
          preference: row['기호식품'],
          memo: row['메모'],
          createdAt: row['등록일시']
        }));

        resolve(processedData);
      } catch (error) {
        reject(new Error('엑셀 파일 처리 중 오류가 발생했습니다: ' + error.message));
      }
    };

    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsArrayBuffer(file);
  });
}; 