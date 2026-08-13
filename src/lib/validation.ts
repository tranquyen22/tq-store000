import { z } from 'zod';

// Helper function to sanitize string and prevent Reflected/Stored XSS attacks
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

// Phone Regex for Vietnamese format (e.g., 0912345678, 0387654321)
const phoneRegex = /(03|05|07|08|09)+[0-9]{8}\b/;

// 1. Zod Schema for Registration Form
export const registerSchema = z.object({
  fullName: z.string()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ và tên không vượt quá 50 ký tự')
    .transform(sanitizeString),
  email: z.string()
    .email('Định dạng email không hợp lệ (ví dụ: user@domain.com)')
    .transform(sanitizeString),
  phone: z.string()
    .regex(phoneRegex, 'Số điện thoại không hợp lệ (ví dụ: 0912345678)'),
  password: z.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu không vượt quá 100 ký tự')
});

// 2. Zod Schema for Login Form
export const loginSchema = z.object({
  identifier: z.string()
    .min(3, 'Email hoặc Số điện thoại quá ngắn')
    .transform(sanitizeString),
  password: z.string()
    .min(1, 'Vui lòng nhập mật khẩu')
});

// 3. Zod Schema for Checkout Form
export const checkoutSchema = z.object({
  customerName: z.string()
    .min(2, 'Họ tên người nhận phải từ 2 ký tự trở lên')
    .max(60, 'Họ tên quá dài')
    .transform(sanitizeString),
  customerPhone: z.string()
    .regex(phoneRegex, 'Số điện thoại nhận hàng không hợp lệ (ví dụ: 0912345678)'),
  customerEmail: z.string()
    .email('Email không đúng định dạng')
    .or(z.literal(''))
    .transform(sanitizeString),
  shippingAddress: z.string()
    .min(5, 'Địa chỉ giao hàng chi tiết phải từ 5 ký tự trở lên')
    .max(200, 'Địa chỉ giao hàng quá dài')
    .transform(sanitizeString),
  paymentMethod: z.enum(['COD', 'MoMo', 'Banking'], {
    errorMap: () => ({ message: 'Phương thức thanh toán không hợp lệ' })
  })
});

// 4. Zod Schema for User Profile Update
export const profileSchema = z.object({
  fullName: z.string()
    .min(2, 'Họ tên phải từ 2 ký tự trở lên')
    .transform(sanitizeString),
  phone: z.string()
    .regex(phoneRegex, 'Số điện thoại không hợp lệ'),
  address: z.string()
    .min(5, 'Địa chỉ phải từ 5 ký tự trở lên')
    .transform(sanitizeString)
});
