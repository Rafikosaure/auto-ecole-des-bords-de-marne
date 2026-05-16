export const formatPhoneDisplay = (phone) => {
  if (!phone) return '';
  const digits = String(phone).replace(/\s/g, '');
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
};

export const normalizePhone = (phone) => {
  if (!phone) return '';
  return String(phone).replace(/\s/g, '');
};
