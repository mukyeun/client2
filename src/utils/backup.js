export const exportBackup = () => {
  try {
    const data = localStorage.getItem('userData');
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
};

export const importBackup = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        localStorage.setItem('userData', JSON.stringify(data));
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};
