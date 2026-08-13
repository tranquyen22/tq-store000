import { z } from 'zod';

export const sanitizeString = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

const phoneRegex = /(03|05|07|08|09)+[0-9]{8}\b/;

export const registerSchema = z.object({
  fullName: z.string()
    .min(2, 'Họ và tên phải từ 2 ký tự trở lên')
    .max(50, 'Họ và tên không quá 50 ký tự')
    .transform(sanitizeString),
  email: z.string()
    .email('Định dạng email không hợp lệ')
    .transform(sanitizeString),
  phone: z.string()
    .regex(phoneRegex, 'Số điện thoại không hợp lệ (vd: 0912345678)'),
  password: z.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});

export const loginSchema = z.object({
  identifier: z.string()
    .min(3, 'Email hoặc SĐT không hợp lệ')
    .transform(sanitizeString),
  password: z.string()
    .min(1, 'Vui lòng nhập mật khẩu')
});
