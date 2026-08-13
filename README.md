# TQ Store - Web Application Full-Stack Realtime (React + Tailwind CSS + Supabase)

**TQ Store** là ứng dụng web thương mại điện tử Full-Stack thời gian thực (Realtime) được nâng cấp toàn bộ sang **React 18 + Vite + TypeScript + Tailwind CSS** kết nối trực tiếp với dịch vụ **Supabase Database & Auth Realtime**.

---

## ⚡ Cấu Hình Supabase Environment (`.env`)

Mã nguồn được cấu hình tự động kết nối với Supabase qua 2 biến môi trường:

```env
VITE_SUPABASE_URL=https://vuzxubiscimbhdtcuqky.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1enh1YmlzY2ltYmhkdGN1cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MjI4MzQsImV4cCI6MjEwMjE5ODgzNH0.KY8WnL5Et1BjjjNWdgFocbASSCkOhV2luM2py01dmkU
```

Khởi tạo Supabase Client tại [`src/lib/supabase.ts`](file:///d:/chinhthuc22/src/lib/supabase.ts):
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 🌟 5 Nhóm Chức Năng Cốt Lõi Triển Khai

1. **Khung Xác Thực Supabase Auth (`AuthContext.tsx`)**:
   - Cho phép Đăng ký & Đăng nhập tài khoản qua Supabase Auth (`signUp`, `signInWithPassword`).
   - Tự động lưu phiên làm việc & lắng nghe trạng thái đăng nhập thời gian thực (`supabase.auth.onAuthStateChange`).
   - Tài khoản dùng thử mẫu: `demo@gmail.com` / `password123`.

2. **Quản Lý Sản Phẩm & 4 Ngành Hàng Sàn TQ Store**:
   - Tải danh sách sản phẩm thời gian thực từ bảng `products` trong Supabase.
   - Duy trì 4 ngành hàng chính:
     - **Thuê quần áo (`rental`)**: Cho thuê Váy dạ hội Luxury kim tuyến, Áo dài thêu tay, Vest nam lịch lãm.
     - **Shop thời trang (`fashion`)**: Đầm lụa Satin cổ V, Áo sơ mi lụa Ý Slim-fit.
     - **Đồ ăn - Đồ uống (`food_beverage`)**: Set Trà sữa Ô long kem trứng nướng (Giao 30P), Bánh mì bơ tỏi phô mai Pháp.
     - **Làm đẹp (`beauty`)**: Bộ Serum Hàn Quốc căng bóng da 50ml, Son lì Matte Lipstick.

3. **Giỏ Hàng Slide-out & Áp Mã Giảm Giá**:
   - Slide-out Cart Drawer hiện đại với đồ họa 3D Glowing Ring khi giỏ trống.
   - Áp mã giảm giá: `GIAM10` (Giảm 10% tổng hóa đơn) hoặc `FREESHIP` (Miễn phí vận chuyển).

4. **Đặt Hàng Lưu Supabase `orders` & `order_items`**:
   - Điền thông tin giao hàng & chọn phương thức thanh toán (COD, MoMo, Banking).
   - Đơn hàng được lưu vào bảng **`orders`** (id, user_id, customer_name, customer_phone, customer_email, shipping_address, payment_method, subtotal, shipping_fee, discount, total, status, created_at).
   - Chi tiết từng món được lưu vào bảng **`order_items`** (order_id, product_id, product_name, price, quantity, image).

5. **Trang Cá Nhân & Lịch Sử Đơn Hàng Realtime (`ProfileModal.tsx`)**:
   - Lắng nghe kênh thời gian thực `supabase.channel('public:orders')` để tự động cập nhật Lịch sử đơn hàng và trạng thái đơn ngay khi người dùng hoàn tất thanh toán!

---

## 📁 Cấu Trúc Thư Mục Dự Án (React Vite Project)

```text
d:/chinhthuc22/
├── .env                       # Biến môi trường VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
├── package.json               # Phụ thuộc React, Vite, TailwindCSS, @supabase/supabase-js
├── tailwind.config.js         # Cấu hình Tailwind CSS & Glassmorphism animations
├── index.html                 # HTML entry
└── src/
    ├── index.css              # Tailwind CSS directives
    ├── main.tsx               # App mounting point with AuthProvider & CartProvider
    ├── App.tsx                # Layout điều phối chính
    ├── lib/
    │   └── supabase.ts        # Supabase client singleton setup
    ├── types/
    │   └── index.ts           # Interfaces cho Product, Order, OrderItem, User
    ├── context/
    │   ├── AuthContext.tsx    # Supabase Auth Provider & Session Listener
    │   └── CartContext.tsx    # Cart & Realtime Orders Provider (bảng orders & order_items)
    └── components/
        ├── Navbar.tsx         # Modern Header với logo TQ Store, live search & cart counter
        ├── Hero.tsx           # Banner giới thiệu 4 ngành hàng TQ Store
        ├── CategorySidebar.tsx# Sidebar lọc 4 danh mục & slider khoảng giá
        ├── ProductCard.tsx    # Thẻ sản phẩm với nút thêm giỏ hàng
        ├── ProductGrid.tsx    # Lưới sản phẩm tải thời gian thực từ Supabase
        ├── ProductDetailModal.tsx # Modal chi tiết sản phẩm
        ├── AuthModal.tsx      # Modal Đăng nhập / Đăng ký Supabase Auth
        ├── CartDrawer.tsx     # Slide-out giỏ hàng với 3D glowing ring & áp voucher
        ├── CheckoutModal.tsx  # Modal Đặt hàng lưu vào orders & order_items
        ├── ProfileModal.tsx   # Modal Hồ sơ & Lịch sử đơn hàng Realtime
        └── Toast.tsx          # Hệ thống thông báo thời gian thực
```

---

## 🚀 Hướng Dẫn Khởi Chạy Ứng Dụng

1. Mở Terminal / PowerShell tại thư mục `d:\chinhthuc22`.
2. Cài đặt thư viện:
   ```bash
   npm install
   ```
3. Khởi chạy server phát triển Vite React:
   ```bash
   npm run dev
   ```
4. Mở trình duyệt truy cập đường dẫn được hiển thị (ví dụ `http://localhost:5173`).
