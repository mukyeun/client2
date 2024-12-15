import ExcelJS from 'exceljs';

export const exportToExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');

  // 헤더 추가
  worksheet.columns = [
    { header: '이름', key: 'name', width: 15 },
    { header: '이메일', key: 'email', width: 30 },
    { header: '생성일', key: 'createdAt', width: 20 }
  ];

  // 데이터 추가
  worksheet.addRows(data);

  // 파일 저장
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `users-${new Date().toISOString()}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const importFromExcel = async (file) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  const worksheet = workbook.getWorksheet(1);
  
  const data = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // 헤더 제외
      data.push({
        name: row.getCell(1).value,
        email: row.getCell(2).value,
        createdAt: row.getCell(3).value
      });
    }
  });
  
  return data;
}; 