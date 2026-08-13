/**
 * TQ Store Universal API Client & Offline Mock Engine
 * Tự động chọn kết nối REST API Server hoặc LocalStorage Mock khi offline.
 */
const API = (() => {
  const BASE_URL = 'http://localhost:5000/api';
  let isBackendAvailable = null;

  // Dữ liệu fallback nếu mở trực tiếp index.html không qua server Node.js
  const defaultMockDB = {
    categories: [
      { id: "all", name: "Tất cả danh mục", icon: "fa-border-all" },
      { id: "rental", name: "Thuê quần áo", icon: "fa-clock-rotate-left" },
      { id: "fashion", name: "Shop thời trang", icon: "fa-shirt" },
      { id: "food_beverage", name: "Đồ ăn - Đồ uống", icon: "fa-utensils" },
      { id: "beauty", name: "Làm đẹp", icon: "fa-wand-magic-sparkles" }
    ],
    products: [
      {
        id: "prod-rental-1",
        name: "Cho Thuê Váy Dạ Hội Luxury Kim Tuyến Sang Trọng (Gói 3 Ngày)",
        category: "rental",
        price: 450000,
        originalPrice: 650000,
        rating: 4.9,
        reviewsCount: 86,
        inStock: 10,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
        badge: "Thuê nhiều nhất",
        description: "Dịch vụ cho thuê đầm dạ hội thiết kế độc quyền đính kim tuyến lấp lánh.",
        specs: { "Thời gian thuê": "3 Ngày", "Size": "S, M, L", "Dịch vụ": "Giặt hấp spa" }
      },
      {
        id: "prod-rental-2",
        name: "Cho Thuê Áo Dài Thêu Tay Cổ Truyền Cao Cấp",
        category: "rental",
        price: 350000,
        originalPrice: 500000,
        rating: 4.8,
        reviewsCount: 42,
        inStock: 15,
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
        badge: "Hot Rental",
        description: "Áo dài truyền thống chất lụa tơ tằm thêu hoa sen tỉ mỉ bằng tay.",
        specs: { "Thời gian thuê": "3 Ngày", "Chất liệu": "Lụa tơ tằm" }
      },
      {
        id: "prod-fashion-1",
        name: "Đầm Lụa Satin Cổ V Dáng Xòe Sang Trọng",
        category: "fashion",
        price: 890000,
        originalPrice: 1200000,
        rating: 4.8,
        reviewsCount: 112,
        inStock: 25,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
        badge: "Bestseller",
        description: "Thiết kế váy đầm lụa Satin cao cấp tôn dáng mềm mại, đường may tinh tế.",
        specs: { "Chất liệu": "Lụa Satin", "Form": "Chiết eo dáng xòe" }
      },
      {
        id: "prod-fashion-2",
        name: "Áo Sơ Mi Nam Lụa Ý Cao Cấp Form Slim-Fit",
        category: "fashion",
        price: 550000,
        originalPrice: 750000,
        rating: 4.7,
        reviewsCount: 78,
        inStock: 40,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
        badge: "Mới",
        description: "Áo sơ mi nam chống nhăn độc quyền, chất liệu lụa Ý mỏng nhẹ thoáng mát.",
        specs: { "Vải": "Cotton Lụa Ý", "Form": "Slim-Fit" }
      },
      {
        id: "prod-food-1",
        name: "Set Trà Sữa Ô Long Kem Trứng Nướng Premium (Combo 4 Ly)",
        category: "food_beverage",
        price: 180000,
        originalPrice: 240000,
        rating: 4.9,
        reviewsCount: 150,
        inStock: 50,
        image: "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80",
        badge: "Giao 30 Phút",
        description: "Trà sữa Ô long lá trà đậm đà kết hợp với lớp kem trứng nướng cháy thơm béo ngậy.",
        specs: { "Combo": "4 Ly Trà sữa 700ml", "Độ ngọt": "Tùy chọn 30%-100%" }
      },
      {
        id: "prod-food-2",
        name: "Bánh Mì Nướng Bơ Tỏi Phô Mai Pháp Handmade",
        category: "food_beverage",
        price: 120000,
        originalPrice: 150000,
        rating: 4.8,
        reviewsCount: 94,
        inStock: 30,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        badge: "Nóng Hổi",
        description: "Ổ bánh mì nướng bơ tỏi giòn rụm đẫm phô mai Mozzarella tan chảy ngậy béo.",
        specs: { "Set": "2 Ổ bánh mì lớn", "Phô mai": "Mozzarella Pháp" }
      },
      {
        id: "prod-beauty-1",
        name: "Bộ Serum Căng Bóng Dưỡng Trắng Da Hàn Quốc (50ml)",
        category: "beauty",
        price: 790000,
        originalPrice: 1100000,
        rating: 4.9,
        reviewsCount: 135,
        inStock: 20,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
        badge: "Chính Hãng",
        description: "Serum chiết xuất Niacinamide 10% & Hyaluronic Acid cấp ẩm sâu, phục hồi da.",
        specs: { "Dung tích": "50ml", "Thành phần": "Niacinamide 10%, HA 2%", "Xuất xứ": "Korea" }
      },
      {
        id: "prod-beauty-2",
        name: "Son Thỏi Hiệu Ứng Lì Mịn Như Nhung Matte Lipstick",
        category: "beauty",
        price: 420000,
        originalPrice: 550000,
        rating: 4.8,
        reviewsCount: 67,
        inStock: 45,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
        badge: "Hot Color",
        description: "Son lì mềm môi không gây khô ráp, lên màu chuẩn ngay từ lần quẹt đầu tiên.",
        specs: { "Tông màu": "Đỏ Đất Rạng Rỡ", "Độ bám": "8-10 tiếng" }
      }
    ],
    users: [
      {
        id: "user-1",
        fullName: "Nguyễn Văn Anh",
        email: "demo@gmail.com",
        phone: "0912345678",
        password: "password123",
        address: "123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
      }
    ],
    orders: [
      {
        id: "ORD-882910",
        userId: "user-1",
        customerName: "Nguyễn Văn Anh",
        customerPhone: "0912345678",
        customerEmail: "demo@gmail.com",
        shippingAddress: "123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
        paymentMethod: "COD",
        items: [
          { id: "prod-3", name: "Tai nghe Sony WH-1000XM5 Chống ồn chủ động", price: 7990000, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" }
        ],
        subtotal: 7990000,
        shippingFee: 0,
        discount: 0,
        total: 7990000,
        status: "Đã giao hàng",
        createdAt: "2026-08-05T14:30:00.000Z"
      }
    ]
  };

  // Đảm bảo có Mock LocalStorage
  function getMockDB() {
    const data = localStorage.getItem('shoppulse_mock_db');
    if (!data) {
      localStorage.setItem('shoppulse_mock_db', JSON.stringify(defaultMockDB));
      return defaultMockDB;
    }
    const parsed = JSON.parse(data);
    // Tự động đồng bộ lại nếu chưa có danh mục mới "rental"
    if (!parsed.categories || !parsed.categories.some(c => c.id === 'rental')) {
      localStorage.setItem('shoppulse_mock_db', JSON.stringify(defaultMockDB));
      return defaultMockDB;
    }
    return parsed;
  }

  function saveMockDB(db) {
    localStorage.setItem('shoppulse_mock_db', JSON.stringify(db));
  }

  // Kiểm tra xem Backend Server có phản hồi không
  async function checkBackendStatus() {
    if (isBackendAvailable !== null) return isBackendAvailable;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${BASE_URL}/categories`, { signal: controller.signal });
      clearTimeout(timeoutId);
      isBackendAvailable = res.ok;
    } catch {
      isBackendAvailable = false;
    }
    return isBackendAvailable;
  }

  return {
    // 1. Lấy danh mục
    getCategories: async () => {
      if (await checkBackendStatus()) {
        const res = await fetch(`${BASE_URL}/categories`);
        const json = await res.json();
        return json.data;
      }
      return getMockDB().categories;
    },

    // 2. Lấy & Lọc sản phẩm
    getProducts: async (params = {}) => {
      if (await checkBackendStatus()) {
        const queryStr = new URLSearchParams(params).toString();
        const res = await fetch(`${BASE_URL}/products?${queryStr}`);
        const json = await res.json();
        return json.data;
      }

      // Offline Mock Filter logic
      const db = getMockDB();
      let list = [...db.products];

      if (params.q) {
        const k = params.q.toLowerCase().trim();
        list = list.filter(p => p.name.toLowerCase().includes(k) || p.description.toLowerCase().includes(k));
      }
      if (params.category && params.category !== 'all') {
        list = list.filter(p => p.category === params.category);
      }
      if (params.maxPrice) {
        list = list.filter(p => p.price <= Number(params.maxPrice));
      }
      if (params.sortBy === 'price-asc') list.sort((a,b) => a.price - b.price);
      else if (params.sortBy === 'price-desc') list.sort((a,b) => b.price - a.price);
      else if (params.sortBy === 'rating') list.sort((a,b) => b.rating - a.rating);

      return list;
    },

    // 3. Đăng ký tài khoản
    register: async (userData) => {
      if (await checkBackendStatus()) {
        const res = await fetch(`${BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        return await res.json();
      }

      // Offline Mock Register
      const db = getMockDB();
      const cleanEmail = userData.email.trim().toLowerCase();
      const cleanPhone = userData.phone.replace(/\s+/g, '');
      
      const exists = db.users.some(u => u.email.toLowerCase() === cleanEmail || u.phone === cleanPhone);
      if (exists) {
        return { success: false, message: 'Email hoặc số điện thoại này đã được sử dụng!' };
      }

      const newUser = {
        id: 'user-' + Date.now(),
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        address: userData.address || ''
      };

      db.users.push(newUser);
      saveMockDB(db);

      const { password: _, ...userNoPass } = newUser;
      return { success: true, message: 'Đăng ký thành công!', user: userNoPass };
    },

    // 4. Đăng nhập (bằng Email hoặc SĐT)
    login: async (identifier, password) => {
      if (await checkBackendStatus()) {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });
        return await res.json();
      }

      // Offline Mock Login
      const db = getMockDB();
      const cleanId = identifier.trim().toLowerCase();
      const cleanPhone = identifier.replace(/\s+/g, '');

      const user = db.users.find(u => 
        u.email.toLowerCase() === cleanId || 
        u.phone.replace(/\s+/g, '') === cleanPhone
      );

      if (!user || user.password !== password) {
        return { success: false, message: 'Email / SĐT hoặc mật khẩu không đúng!' };
      }

      const { password: _, ...userNoPass } = user;
      return { success: true, message: 'Đăng nhập thành công!', user: userNoPass };
    },

    // 5. Cập nhật hồ sơ cá nhân
    updateProfile: async (profileData) => {
      if (await checkBackendStatus()) {
        const res = await fetch(`${BASE_URL}/users/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData)
        });
        return await res.json();
      }

      const db = getMockDB();
      const idx = db.users.findIndex(u => u.id === profileData.userId);
      if (idx !== -1) {
        db.users[idx].fullName = profileData.fullName;
        db.users[idx].phone = profileData.phone;
        db.users[idx].address = profileData.address;
        saveMockDB(db);
        const { password: _, ...userNoPass } = db.users[idx];
        return { success: true, message: 'Cập nhật thông tin thành công!', user: userNoPass };
      }
      return { success: false, message: 'Không tìm thấy người dùng' };
    },

    // 6. Đặt hàng
    createOrder: async (orderData) => {
      if (await checkBackendStatus()) {
        const res = await fetch(`${BASE_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        return await res.json();
      }

      const db = getMockDB();
      const newOrder = {
        id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        userId: orderData.userId || 'guest',
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod || 'COD',
        items: orderData.items || [],
        subtotal: orderData.subtotal,
        shippingFee: orderData.shippingFee || 0,
        discount: orderData.discount || 0,
        total: orderData.total,
        status: 'Đang xử lý',
        createdAt: new Date().toISOString()
      };

      db.orders.unshift(newOrder);
      saveMockDB(db);
      return { success: true, message: 'Đặt hàng thành công!', order: newOrder };
    },

    // 7. Lịch sử đơn hàng
    getUserOrders: async (userId) => {
      if (await checkBackendStatus()) {
        const res = await fetch(`${BASE_URL}/orders/user/${userId}`);
        const json = await res.json();
        return json.data;
      }

      const db = getMockDB();
      return db.orders.filter(o => o.userId === userId);
    }
  };
})();
