import { z } from 'zod';
import { sanitizeString } from '@/features/auth/validation';

const phoneRegex = /(03|05|07|08|09)+[0-9]{8}\b/;

export const checkoutSchema = z.object({
  customerName: z.string()
    .min(2, 'Họ tên người nhận phải từ 2 ký tự trở lên')
    .max(60, 'Họ tên quá dài')
    .transform(sanitizeString),
  customerPhone: z.string()
    .regex(phoneRegex, 'Số điện thoại nhận hàng không hợp lệ (vd: 0912345678)'),
  customerEmail: z.string()
    .email('Email không đúng định dạng')
    .or(z.literal(''))
    .transform(sanitizeString),
  shippingAddress: z.string()
    .min(5, 'Địa chỉ giao hàng chi tiết phải từ 5 ký tự trở lên')
    .max(200, 'Địa chỉ quá dài')
    .transform(sanitizeString),
  paymentMethod: z.enum(['COD', 'MoMo', 'Banking'], {
    errorMap: () => ({ message: 'Phương thức thanh toán không hợp lệ' })
  })
});
