export const sanitizeData = (data) => {
  const sanitized = {};
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string') {
      sanitized[key] = data[key]
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    } else {
      sanitized[key] = data[key];
    }
  });
  return sanitized;
};
