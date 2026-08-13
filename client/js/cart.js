/**
 * Shopping Cart & Checkout Module
 * Quản lý giỏ hàng, cập nhật số lượng, voucher giảm giá, tính tổng tiền & Đặt hàng
 */
const cartUI = (() => {
  let cart = [];
  let currentDiscountRate = 0; // 0.10 cho 10%
  let isFreeShipVoucher = false;

  function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  // Khởi tạo giỏ hàng từ localStorage
  function initCart() {
    const savedCart = localStorage.getItem('shoppulse_cart_items');
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch (e) {
        cart = [];
      }
    }
    updateCartUI();
    bindEvents();
  }

  // Lưu giỏ hàng vào localStorage
  function saveCart() {
    localStorage.setItem('shoppulse_cart_items', JSON.stringify(cart));
    updateCartUI();
  }

  // Thêm sản phẩm vào giỏ hàng
  function addToCart(productId, quantity = 1) {
    const products = productsUI.getAllProducts();
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity
      });
    }

    saveCart();
    app.showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
  }

  // Cập nhật số lượng sản phẩm trong giỏ
  function updateQuantity(productId, delta) {
    const idx = cart.findIndex(i => i.id === productId);
    if (idx !== -1) {
      cart[idx].quantity += delta;
      if (cart[idx].quantity <= 0) {
        cart.splice(idx, 1);
      }
      saveCart();
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    app.showToast('Đã xóa sản phẩm khỏi giỏ hàng.', 'info');
  }

  // Cập nhật giao diện Giỏ Hàng (Cart Drawer & Badge Count)
  function updateCartUI() {
    const badgeEl = document.getElementById('cart-badge-count');
    const drawerCountEl = document.getElementById('cart-drawer-count');
    const itemsListEl = document.getElementById('cart-items-list');

    const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    if (badgeEl) badgeEl.textContent = totalCount;
    if (drawerCountEl) drawerCountEl.textContent = totalCount;

    if (!itemsListEl) return;

    if (cart.length === 0) {
      itemsListEl.innerHTML = `
        <div class="empty-cart-container">
          <div class="empty-cart-glow-ring">
            <i class="fa-solid fa-cart-arrow-down main-cart-icon"></i>
            <i class="fa-solid fa-sparkles empty-cart-sparkle"></i>
          </div>
          <h4>Giỏ hàng của bạn đang trống</h4>
          <p>Hãy khám phá các sản phẩm công nghệ & thời trang chính hãng với ưu đãi hấp dẫn ngay hôm nay!</p>
          <button class="btn btn-gradient btn-md" onclick="app.closeDrawer('cart-drawer')">
            <i class="fa-solid fa-bag-shopping"></i> Khám phá sản phẩm ngay
          </button>
        </div>
      `;
    } else {
      itemsListEl.innerHTML = cart.map(item => `
        <div class="cart-item-card">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">${formatCurrency(item.price)}</div>
            <div class="cart-item-controls">
              <div class="quantity-picker" style="margin-bottom: 0;">
                <button class="qty-btn" onclick="cartUI.updateQuantity('${item.id}', -1)">-</button>
                <span class="qty-input" style="display: inline-block; line-height: 24px;">${item.quantity}</span>
                <button class="qty-btn" onclick="cartUI.updateQuantity('${item.id}', 1)">+</button>
              </div>
              <button class="cart-remove-btn" onclick="cartUI.removeFromCart('${item.id}')">
                <i class="fa-regular fa-trash-can"></i> Xóa
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }

    calculateTotals();
  }

  // Tính toán Tạm tính, Phí ship, Giảm giá và Tổng cộng
  function calculateTotals() {
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    
    // Miễn phí ship cho đơn từ 1.000.000đ trở lên hoặc có voucher FREESHIP
    let shippingFee = subtotal >= 1000000 || subtotal === 0 || isFreeShipVoucher ? 0 : 30000;
    let discount = Math.round(subtotal * currentDiscountRate);
    let total = subtotal + shippingFee - discount;
    if (total < 0) total = 0;

    const subtotalEl = document.getElementById('cart-subtotal-val');
    const shippingEl = document.getElementById('cart-shipping-val');
    const discountWrapper = document.getElementById('cart-discount-wrapper');
    const discountEl = document.getElementById('cart-discount-val');
    const totalEl = document.getElementById('cart-total-val');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (shippingEl) shippingEl.textContent = shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee);

    if (discountWrapper && discountEl) {
      if (discount > 0 || isFreeShipVoucher) {
        discountWrapper.style.display = 'flex';
        discountEl.textContent = `- ${formatCurrency(discount)}`;
      } else {
        discountWrapper.style.display = 'none';
      }
    }

    if (totalEl) totalEl.textContent = formatCurrency(total);

    return { subtotal, shippingFee, discount, total };
  }

  // Áp dụng mã giảm giá (Coupon Voucher)
  function applyVoucher() {
    const input = document.getElementById('voucher-code-input');
    const msgEl = document.getElementById('voucher-message');
    if (!input || !msgEl) return;

    const code = input.value.trim().toUpperCase();
    if (code === 'GIAM10') {
      currentDiscountRate = 0.10;
      isFreeShipVoucher = false;
      msgEl.style.color = 'var(--success)';
      msgEl.textContent = '✓ Đã áp dụng voucher GIAM10 (Giảm 10% tổng hóa đơn)!';
      app.showToast('Áp dụng mã giảm 10% thành công!', 'success');
    } else if (code === 'FREESHIP') {
      isFreeShipVoucher = true;
      currentDiscountRate = 0;
      msgEl.style.color = 'var(--success)';
      msgEl.textContent = '✓ Đã áp dụng voucher FREESHIP (Miễn phí vận chuyển)!';
      app.showToast('Áp dụng mã miễn phí ship thành công!', 'success');
    } else {
      msgEl.style.color = 'var(--danger)';
      msgEl.textContent = '✕ Mã giảm giá không hợp lệ. Thử nhập: GIAM10 hoặc FREESHIP';
    }

    calculateTotals();
  }

  // Mở Modal Thanh Toán (Checkout)
  function prepareCheckout() {
    if (cart.length === 0) {
      app.showToast('Giỏ hàng của bạn chưa có sản phẩm nào!', 'error');
      return;
    }

    const currentUser = authUI.getCurrentUser();
    const nameInput = document.getElementById('checkout-name');
    const phoneInput = document.getElementById('checkout-phone');
    const emailInput = document.getElementById('checkout-email');
    const addressInput = document.getElementById('checkout-address');

    if (currentUser) {
      if (nameInput) nameInput.value = currentUser.fullName || '';
      if (phoneInput) phoneInput.value = currentUser.phone || '';
      if (emailInput) emailInput.value = currentUser.email || '';
      if (addressInput) addressInput.value = currentUser.address || '';
    }

    // Render Preview các món hàng trong đơn
    const previewEl = document.getElementById('checkout-items-preview');
    if (previewEl) {
      previewEl.innerHTML = cart.map(i => `
        <div class="co-item">
          <img src="${i.image}" alt="${i.name}">
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 0.85rem;">${i.name}</div>
            <div style="color: var(--text-muted); font-size: 0.8rem;">SL: ${i.quantity} x ${formatCurrency(i.price)}</div>
          </div>
          <div style="font-weight: 800;">${formatCurrency(i.price * i.quantity)}</div>
        </div>
      `).join('');
    }

    const { subtotal, shippingFee, discount, total } = calculateTotals();
    
    document.getElementById('co-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('co-shipping').textContent = shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee);
    
    const coDiscountRow = document.getElementById('co-discount-row');
    if (coDiscountRow) {
      if (discount > 0) {
        coDiscountRow.style.display = 'flex';
        document.getElementById('co-discount').textContent = `- ${formatCurrency(discount)}`;
      } else {
        coDiscountRow.style.display = 'none';
      }
    }
    
    document.getElementById('co-total').textContent = formatCurrency(total);

    app.closeDrawer('cart-drawer');
    app.openModal('checkout-modal');
  }

  // Xử lý nộp form đặt hàng (Order Submission)
  async function handleCheckoutSubmit(e) {
    e.preventDefault();
    if (cart.length === 0) return;

    const currentUser = authUI.getCurrentUser();
    const customerName = document.getElementById('checkout-name').value;
    const customerPhone = document.getElementById('checkout-phone').value;
    const customerEmail = document.getElementById('checkout-email').value;
    const shippingAddress = document.getElementById('checkout-address').value;
    
    const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
    const paymentMethod = paymentRadio ? paymentRadio.value : 'COD';

    const { subtotal, shippingFee, discount, total } = calculateTotals();

    const orderData = {
      userId: currentUser ? currentUser.id : 'guest',
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      paymentMethod,
      items: [...cart],
      subtotal,
      shippingFee,
      discount,
      total
    };

    const res = await API.createOrder(orderData);

    if (res.success) {
      app.showToast('🎉 Đặt hàng thành công! Mã đơn của bạn là: ' + res.order.id, 'success');
      
      // Xóa giỏ hàng
      cart = [];
      saveCart();

      app.closeModal('checkout-modal');

      // Nếu đã đăng nhập thì mở profile để xem đơn hàng
      if (currentUser) {
        setTimeout(() => {
          app.openModal('profile-modal');
          profileUI.switchTab('orders');
        }, 500);
      }
    } else {
      app.showToast(res.message, 'error');
    }
  }

  // Gắn các sự kiện
  function bindEvents() {
    const applyVoucherBtn = document.getElementById('apply-voucher-btn');
    const proceedCheckoutBtn = document.getElementById('btn-proceed-checkout');
    const checkoutForm = document.getElementById('checkout-form');

    if (applyVoucherBtn) applyVoucherBtn.addEventListener('click', applyVoucher);
    if (proceedCheckoutBtn) proceedCheckoutBtn.addEventListener('click', prepareCheckout);
    if (checkoutForm) checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  return {
    initCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCart: () => cart,
    prepareCheckout
  };
})();
