/**
  Mã hóa che giấu Số điện thoại theo quy chuẩn bảo mật PII
  Ví dụ: 0987654321 -> 098*1234** (hoặc 098***4321)
 */
export const maskPhoneNumber = (phone?: string | null): string => {
  if (!phone) return 'N/A';
  const cleanPhone = phone.trim().replace(/\s+/g, '');
  if (cleanPhone.length < 7) return '***';
  const prefix = cleanPhone.slice(0, 3);
  const mid = cleanPhone.slice(3, 7);
  const suffix = cleanPhone.slice(7).replace(/\d/g, '*');
  return `${prefix}*${mid}${suffix || '**'}`;
};

/**
  Mã hóa che giấu Căn cước công dân (CCCD / CMND)
  Ví dụ: 036123456789 -> 036*******89
 */
export const maskCitizenID = (idNumber?: string | null): string => {
  if (!idNumber) return 'N/A';
  const cleanId = idNumber.trim();
  if (cleanId.length < 6) return '***';
  const start = cleanId.slice(0, 3);
  const end = cleanId.slice(-2);
  const maskLen = Math.max(3, cleanId.length - 5);
  return `${start}${Array(maskLen + 1).join('*')}${end}`;
};

/**
  Mã hóa che giấu Email cá nhân
  Ví dụ: nguyen.van.a@gmail.com -> ngu***@gmail.com
 */
export const maskEmail = (email?: string | null): string => {
  if (!email || !email.includes('@')) return 'N/A';
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 3) {
    return `${localPart.charAt(0)}***@${domain}`;
  }
  return `${localPart.slice(0, 3)}***@${domain}`;
};
