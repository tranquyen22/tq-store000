const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Hàm đọc dữ liệu từ file db.json
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { categories: [], products: [], users: [], orders: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Lỗi khi đọc file db.json:', err);
    return { categories: [], products: [], users: [], orders: [] };
  }
}

// Hàm ghi dữ liệu vào file db.json
function writeDB(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Lỗi khi ghi file db.json:', err);
    return false;
  }
}

module.exports = {
  // Lấy toàn bộ danh mục sản phẩm
  getCategories: () => {
    const db = readDB();
    return db.categories || [];
  },

  // Lấy và lọc danh sách sản phẩm
  getProducts: ({ q, category, minPrice, maxPrice, sortBy }) => {
    const db = readDB();
    let result = [...(db.products || [])];

    // Lọc theo từ khóa tìm kiếm
    if (q) {
      const keyword = q.trim().toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(keyword) || 
        p.description.toLowerCase().includes(keyword)
      );
    }

    // Lọc theo danh mục
    if (category && category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    // Lọc theo khoảng giá
    if (minPrice !== undefined && !isNaN(minPrice)) {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    // Sắp xếp
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.reverse();
    }

    return result;
  },

  // Lấy chi tiết sản phẩm theo ID
  getProductById: (id) => {
    const db = readDB();
    return db.products.find(p => p.id === id) || null;
  },

  // Tìm người dùng theo Email hoặc Số điện thoại
  findUserByEmailOrPhone: (identifier) => {
    const db = readDB();
    const cleanId = identifier.trim().toLowerCase();
    return db.users.find(u => 
      u.email.toLowerCase() === cleanId || 
      u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')
    ) || null;
  },

  // Thêm người dùng mới (Đăng ký)
  createUser: (userData) => {
    const db = readDB();
    
    // Kiểm tra xem email hoặc sdt đã tồn tại chưa
    const exists = db.users.some(u => 
      u.email.toLowerCase() === userData.email.trim().toLowerCase() ||
      u.phone.replace(/\s+/g, '') === userData.phone.trim().replace(/\s+/g, '')
    );

    if (exists) {
      throw new Error('Email hoặc số điện thoại này đã được đăng ký tài khoản!');
    }

    const newUser = {
      id: 'user-' + Date.now(),
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password, // Trong thực tế nên bcrypt hash
      address: userData.address || '',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);
    return newUser;
  },

  // Cập nhật thông tin cá nhân người dùng
  updateUserProfile: (userId, updateData) => {
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    db.users[userIndex] = {
      ...db.users[userIndex],
      fullName: updateData.fullName || db.users[userIndex].fullName,
      phone: updateData.phone || db.users[userIndex].phone,
      address: updateData.address || db.users[userIndex].address
    };

    writeDB(db);
    return db.users[userIndex];
  },

  // Tạo đơn hàng mới
  createOrder: (orderData) => {
    const db = readDB();
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
    writeDB(db);
    return newOrder;
  },

  // Lấy lịch sử đơn hàng của người dùng
  getUserOrders: (userId) => {
    const db = readDB();
    return db.orders.filter(o => o.userId === userId);
  }
};
