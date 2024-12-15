import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName = 'user-info.xlsx') => {
  // 데이터 가공
  const processedData = data.map(item => ({
    이름: item.name,
    연락처: item.phone,
    주민등록번호: item.residentNumber,
    성별: item.gender === 'male' ? '남성' : '여성',
    맥박: item.pulse,
    수축기혈압: item.systolicBP,
    이완기혈압: item.diastolicBP,
    증상: item.selectedSymptoms.join(', '),
    복용약물: item.medication,
    기호식품: item.preference,
    메모: item.memo,
    등록일시: new Date(item.createdAt).toLocaleString()
  }));

  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'UserInfo');
  XLSX.writeFile(workbook, fileName);
};
