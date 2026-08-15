/**
  Định dạng số tiền sang chuẩn Việt Nam Đồng (VND)
  Ví dụ: 1500000 -> "1.500.000 ₫"
 */
export const formatVND = (amount: number | bigint | string = 0): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (isNaN(num)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(num);
};

/**
  Định dạng thời gian chuẩn ISO sang hiển thị Việt Nam
  Ví dụ: "2026-08-15T07:55:00Z" -> "14:55 15/08/2026"
 */
export const formatDateVN = (dateInput?: Date | string | number | null): string => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};
