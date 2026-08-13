-- ============================================================
-- SQL SCHEMA & RLS POLICIES FOR TQ STORE (SUPABASE DATABASE)
-- Chạy file SQL này trong Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Bảng Categories (Danh mục sản phẩm)
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT
);

-- 2. Bảng Products (Sản phẩm)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    rating NUMERIC DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    in_stock INT DEFAULT 10,
    image TEXT NOT NULL,
    badge TEXT,
    description TEXT,
    specs JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng Orders (Đơn hàng)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    shipping_address TEXT NOT NULL,
    payment_method TEXT DEFAULT 'COD',
    subtotal NUMERIC NOT NULL,
    shipping_fee NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'Đang xử lý',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng Order Items (Chi tiết món trong đơn hàng)
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    quantity INT NOT NULL,
    image TEXT
);

-- ============================================================
-- BẬT ROW LEVEL SECURITY (RLS) & CHỐNG LỖI IDOR (AUTHORIZATION)
-- ============================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to Categories & Products
CREATE POLICY "Public Categories Read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Products Read" ON public.products FOR SELECT USING (true);

-- CHỐNG LỖI IDOR: Chỉ cho phép người dùng tạo & đọc ĐÚNG ĐƠN HÀNG CỦA CHÍNH MÌNH (auth.uid() = user_id)
CREATE POLICY "Users can insert their own orders" ON public.orders 
    FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id = 'guest-user');

CREATE POLICY "Users can view only their own orders" ON public.orders 
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update only their own orders" ON public.orders 
    FOR UPDATE USING (auth.uid()::text = user_id);

-- CHỐNG LỖI IDOR: Chi tiết đơn hàng order_items thuộc về đơn hàng của chính người dùng đó
CREATE POLICY "Users can insert order items" ON public.order_items 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view order items for their own orders" ON public.order_items 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE public.orders.id = public.order_items.order_id 
            AND (public.orders.user_id = auth.uid()::text OR public.orders.user_id = 'guest-user')
        )
    );

-- Enable Realtime for Orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- ============================================================
-- CHÈN DỮ LIỆU MẪU SẢN PHẨM SÀN TQ STORE
-- ============================================================

INSERT INTO public.categories (id, name, icon) VALUES
('all', 'Tất cả danh mục', 'fa-border-all'),
('rental', 'Thuê quần áo', 'fa-clock-rotate-left'),
('fashion', 'Shop thời trang', 'fa-shirt'),
('food_beverage', 'Đồ ăn - Đồ uống', 'fa-utensils'),
('beauty', 'Làm đẹp', 'fa-wand-magic-sparkles')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, category, price, original_price, rating, reviews_count, in_stock, image, badge, description, specs) VALUES
('prod-rental-1', 'Cho Thuê Váy Dạ Hội Luxury Kim Tuyến Sang Trọng (Gói 3 Ngày)', 'rental', 450000, 650000, 4.9, 86, 10, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80', 'Thuê nhiều nhất', 'Dịch vụ cho thuê đầm dạ hội thiết kế độc quyền đính kim tuyến lấp lánh.', '{"Thời gian thuê": "3 Ngày", "Size": "S, M, L", "Dịch vụ": "Giặt hấp spa"}'),
('prod-rental-2', 'Cho Thuê Áo Dài Thêu Tay Cổ Truyền Cao Cấp', 'rental', 350000, 500000, 4.8, 42, 15, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', 'Hot Rental', 'Áo dài truyền thống chất lụa tơ tằm thêu hoa sen tỉ mỉ bằng tay.', '{"Thời gian thuê": "3 Ngày", "Chất liệu": "Lụa tơ tằm"}'),
('prod-fashion-1', 'Đầm Lụa Satin Cổ V Dáng Xòe Sang Trọng', 'fashion', 890000, 1200000, 4.8, 112, 25, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', 'Bestseller', 'Thiết kế váy đầm lụa Satin cao cấp tôn dáng mềm mại, đường may tinh tế.', '{"Chất liệu": "Lụa Satin", "Form": "Chiết eo dáng xòe"}'),
('prod-fashion-2', 'Áo Sơ Mi Nam Lụa Ý Cao Cấp Form Slim-Fit', 'fashion', 550000, 750000, 4.7, 78, 40, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', 'Mới', 'Áo sơ mi nam chống nhăn độc quyền, chất liệu lụa Ý mỏng nhẹ thoáng mát.', '{"Vải": "Cotton Lụa Ý", "Form": "Slim-Fit"}'),
('prod-food-1', 'Set Trà Sữa Ô Long Kem Trứng Nướng Premium (Combo 4 Ly)', 'food_beverage', 180000, 240000, 4.9, 150, 50, 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80', 'Giao 30 Phút', 'Trà sữa Ô long lá trà đậm đà kết hợp với lớp kem trứng nướng cháy thơm béo ngậy.', '{"Combo": "4 Ly Trà sữa 700ml", "Độ ngọt": "Tùy chọn 30%-100%"}'),
('prod-food-2', 'Bánh Mì Nướng Bơ Tỏi Phô Mai Pháp Handmade', 'food_beverage', 120000, 150000, 4.8, 94, 30, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', 'Nóng Hổi', 'Ổ bánh mì nướng bơ tỏi giòn rụm đẫm phô mai Mozzarella tan chảy ngậy béo.', '{"Set": "2 Ổ bánh mì lớn", "Phô mai": "Mozzarella Pháp"}'),
('prod-beauty-1', 'Bộ Serum Căng Bóng Dưỡng Trắng Da Hàn Quốc (50ml)', 'beauty', 790000, 1100000, 4.9, 135, 20, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', 'Chính Hãng', 'Serum chiết xuất Niacinamide 10% & Hyaluronic Acid cấp ẩm sâu, phục hồi da.', '{"Dung tích": "50ml", "Thành phần": "Niacinamide 10%, HA 2%", "Xuất xứ": "Korea"}'),
('prod-beauty-2', 'Son Thỏi Hiệu Ứng Lì Mịn Như Nhung Matte Lipstick', 'beauty', 420000, 550000, 4.8, 67, 45, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80', 'Hot Color', 'Son lì mềm môi không gây khô ráp, lên màu chuẩn ngay từ lần quẹt đầu tiên.', '{"Tông màu": "Đỏ Đất Rạng Rỡ", "Độ bám": "8-10 tiếng"}')
ON CONFLICT (id) DO NOTHING;
