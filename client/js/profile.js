/**
 * User Profile & Order History Module
 * Quản lý thông tin cá nhân người dùng, Địa chỉ giao hàng & Lịch sử đơn hàng
 */
const profileUI = (() => {

  function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  // Tải thông tin người dùng vào Form
  async function loadUserData() {
    const user = authUI.getCurrentUser();
    if (!user) return;

    // Cập nhật thông tin trên Sidebar Profile
    const sidebarName = document.getElementById('profile-sidebar-name');
    const sidebarEmail = document.getElementById('profile-sidebar-email');
    const avatarCircle = document.getElementById('profile-avatar-initials');

    if (sidebarName) sidebarName.textContent = user.fullName;
    if (sidebarEmail) sidebarEmail.textContent = user.email;
    if (avatarCircle) avatarCircle.textContent = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

    // Điền dữ liệu vào Form Tab 1
    const nameInput = document.getElementById('pinfo-name');
    const phoneInput = document.getElementById('pinfo-phone');
    const emailInput = document.getElementById('pinfo-email');
    const addressInput = document.getElementById('pinfo-address');

    if (nameInput) nameInput.value = user.fullName || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (emailInput) emailInput.value = user.email || '';
    if (addressInput) addressInput.value = user.address || '';

    // Tải danh sách đơn hàng
    await loadOrderHistory();
  }

  // Chuyển tab giữa "Thông tin cá nhân" và "Lịch sử đơn hàng"
  function switchTab(tabName) {
    const tabInfo = document.getElementById('ptab-info');
    const tabOrders = document.getElementById('ptab-orders');
    const menuInfoBtn = document.getElementById('pmenu-info-btn');
    const menuOrdersBtn = document.getElementById('pmenu-orders-btn');

    if (tabName === 'info') {
      if (tabInfo) tabInfo.style.display = 'block';
      if (tabOrders) tabOrders.style.display = 'none';
      if (menuInfoBtn) menuInfoBtn.classList.add('active');
      if (menuOrdersBtn) menuOrdersBtn.classList.remove('active');
    } else {
      if (tabInfo) tabInfo.style.display = 'none';
      if (tabOrders) tabOrders.style.display = 'block';
      if (menuInfoBtn) menuInfoBtn.classList.remove('active');
      if (menuOrdersBtn) menuOrdersBtn.classList.add('active');
      loadOrderHistory();
    }
  }

  // Xử lý nộp form Cập nhật thông tin
  async function handleProfileUpdate(e) {
    e.preventDefault();
    const user = authUI.getCurrentUser();
    if (!user) return;

    const fullName = document.getElementById('pinfo-name').value;
    const phone = document.getElementById('pinfo-phone').value;
    const address = document.getElementById('pinfo-address').value;

    const result = await API.updateProfile({
      userId: user.id,
      fullName,
      phone,
      address
    });

    if (result.success) {
      authUI.setCurrentUser(result.user);
      app.showToast('Cập nhật thông tin cá nhân thành công!', 'success');
      loadUserData();
    } else {
      app.showToast(result.message, 'error');
    }
  }

  // Tải & Render Lịch sử đơn hàng
  async function loadOrderHistory() {
    const user = authUI.getCurrentUser();
    const container = document.getElementById('order-history-list');
    if (!container || !user) return;

    container.innerHTML = '<div style="text-align:center; padding: 20px;"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải đơn hàng...</div>';

    const orders = await API.getUserOrders(user.id);

    if (orders.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          <i class="fa-solid fa-box-open" style="font-size: 2.5rem; margin-bottom: 10px; opacity: 0.5;"></i>
          <p>Bạn chưa có đơn hàng nào đã đặt.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => `
      <div class="order-card">
        <div class="order-card-header">
          <div>
            <strong>Mã đơn: <span style="color: var(--primary);">${order.id}</span></strong>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
              <i class="fa-regular fa-calendar"></i> ${new Date(order.createdAt).toLocaleString('vi-VN')}
            </div>
          </div>
          <span class="status-badge">${order.status || 'Đang xử lý'}</span>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">
          <p><i class="fa-solid fa-location-dot"></i> <strong>Địa chỉ giao:</strong> ${order.shippingAddress}</p>
          <p><i class="fa-solid fa-credit-card"></i> <strong>Thanh toán:</strong> ${order.paymentMethod}</p>
        </div>

        <!-- Danh sách các món trong đơn -->
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; background: var(--bg-surface); padding: 10px; border-radius: var(--radius-sm);">
          ${order.items.map(item => `
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <img src="${item.image}" alt="${item.name}" style="width: 36px; height: 36px; object-fit: cover; border-radius: 4px;">
                <span>${item.name} <strong>x${item.quantity}</strong></span>
              </div>
              <span style="font-weight: 700;">${formatCurrency(item.price * item.quantity)}</span>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; border-top: 1px dashed var(--border-color); padding-top: 8px;">
          <span>Tổng số tiền:</span>
          <span style="font-size: 1.1rem; font-weight: 800; color: var(--primary);">${formatCurrency(order.total)}</span>
        </div>
      </div>
    `).join('');
  }

  function bindEvents() {
    const profileForm = document.getElementById('profile-info-form');
    if (profileForm) profileForm.addEventListener('submit', handleProfileUpdate);
  }

  return {
    loadUserData,
    switchTab,
    loadOrderHistory,
    bindEvents
  };
})();
