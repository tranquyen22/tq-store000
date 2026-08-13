const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

// 1. API Danh mục
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh mục' });
  }
});

// 2. API Danh sách & Lọc sản phẩm
app.get('/api/products', (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sortBy } = req.query;
    const products = db.getProducts({ q, category, minPrice, maxPrice, sortBy });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách sản phẩm' });
  }
});

// 3. API Chi tiết sản phẩm
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin sản phẩm' });
  }
});

// 4. API Đăng ký tài khoản
app.post('/api/auth/register', (req, res) => {
  try {
    const { fullName, email, phone, password, address } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ các thông tin: Họ tên, Email, Số điện thoại và Mật khẩu' 
      });
    }

    const newUser = db.createUser({ fullName, email, phone, password, address });
    
    // Loại bỏ mật khẩu khi trả về client
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      user: userWithoutPassword,
      token: 'jwt-mock-token-' + newUser.id
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 5. API Đăng nhập (Cho phép đăng nhập bằng SĐT hoặc Email)
app.post('/api/auth/login', (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier có thể là sdt hoặc email

    if (!identifier || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng nhập Email hoặc Số điện thoại và Mật khẩu' 
      });
    }

    const user = db.findUserByEmailOrPhone(identifier);
    if (!user || user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email / Số điện thoại hoặc mật khẩu không chính xác' 
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: userWithoutPassword,
      token: 'jwt-mock-token-' + user.id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập' });
  }
});

// 6. API Cập nhật Thông tin cá nhân người dùng
app.put('/api/users/profile', (req, res) => {
  try {
    const { userId, fullName, phone, address } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Thiếu ID người dùng' });
    }

    const updatedUser = db.updateUserProfile(userId, { fullName, phone, address });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({ success: true, message: 'Cập nhật thông tin thành công!', user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật hồ sơ' });
  }
});

// 7. API Đặt hàng (Checkout / Create Order)
app.post('/api/orders', (req, res) => {
  try {
    const { userId, customerName, customerPhone, customerEmail, shippingAddress, paymentMethod, items, subtotal, shippingFee, discount, total } = req.body;

    if (!customerName || !customerPhone || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thông tin đơn hàng không hợp lệ. Vui lòng kiểm tra lại thông tin giao hàng và giỏ hàng.' 
      });
    }

    const newOrder = db.createOrder({
      userId,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      paymentMethod,
      items,
      subtotal,
      shippingFee,
      discount,
      total
    });

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công! Cảm ơn bạn đã mua hàng.',
      order: newOrder
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi tạo đơn hàng' });
  }
});

// 8. API Lấy lịch sử đơn hàng của người dùng
app.get('/api/orders/user/:userId', (req, res) => {
  try {
    const orders = db.getUserOrders(req.params.userId);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy lịch sử đơn hàng' });
  }
});

// Phục vụ trang HTML chính cho mọi các route không phải API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  E-Commerce Full-Stack Server đang chạy tại:`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`====================================================`);
});
