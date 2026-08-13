/**
 * Authentication Module
 * Quản lý phiên làm việc của người dùng, Đăng ký & Đăng nhập (SĐT / Email)
 */
const authUI = (() => {
  let currentUser = null;

  // Khởi tạo phiên người dùng từ localStorage khi load trang
  function initAuth() {
    const savedUser = localStorage.getItem('shoppulse_current_user');
    if (savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
        updateHeaderUserUI();
      } catch (e) {
        localStorage.removeItem('shoppulse_current_user');
      }
    }
  }

  // Chuyển tab Đăng nhập <-> Đăng ký
  function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const loginTabBtn = document.getElementById('tab-login-btn');
    const regTabBtn = document.getElementById('tab-register-btn');

    if (tab === 'login') {
      loginForm.style.display = 'flex';
      regForm.style.display = 'none';
      loginTabBtn.classList.add('active');
      regTabBtn.classList.remove('active');
    } else {
      loginForm.style.display = 'none';
      regForm.style.display = 'flex';
      loginTabBtn.classList.remove('active');
      regTabBtn.classList.add('active');
    }
  }

  // Cập nhật giao diện Header theo trạng thái đăng nhập
  function updateHeaderUserUI() {
    const container = document.getElementById('user-header-area');
    if (!container) return;

    if (currentUser) {
      const initial = currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U';
      container.innerHTML = `
        <div class="user-profile-chip" onclick="app.openModal('profile-modal'); profileUI.loadUserData();">
          <div class="user-avatar-small">${initial}</div>
          <span style="font-weight: 700; font-size: 0.9rem;">${currentUser.fullName}</span>
          <i class="fa-solid fa-chevron-down" style="font-size: 0.75rem; color: var(--text-muted);"></i>
        </div>
      `;
    } else {
      container.innerHTML = `
        <button id="open-auth-btn" class="btn btn-primary btn-sm" onclick="app.openModal('auth-modal')">
          <i class="fa-regular fa-user"></i> Đăng ký / Đăng nhập
        </button>
      `;
    }
  }

  // Xử lý gửi Form Đăng nhập
  async function handleLoginSubmit(e) {
    e.preventDefault();
    const identifier = document.getElementById('login-identifier').value;
    const password = document.getElementById('login-password').value;

    const result = await API.login(identifier, password);
    if (result.success) {
      currentUser = result.user;
      localStorage.setItem('shoppulse_current_user', JSON.stringify(currentUser));
      updateHeaderUserUI();
      app.closeModal('auth-modal');
      app.showToast(`Chào mừng bạn trở lại, ${currentUser.fullName}!`, 'success');
      document.getElementById('login-form').reset();
    } else {
      app.showToast(result.message, 'error');
    }
  }

  // Xử lý gửi Form Đăng ký
  async function handleRegisterSubmit(e) {
    e.preventDefault();
    const fullName = document.getElementById('reg-fullname').value;
    const phone = document.getElementById('reg-phone').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const result = await API.register({ fullName, phone, email, password });
    if (result.success) {
      currentUser = result.user;
      localStorage.setItem('shoppulse_current_user', JSON.stringify(currentUser));
      updateHeaderUserUI();
      app.closeModal('auth-modal');
      app.showToast('Đăng ký tài khoản mới thành công!', 'success');
      document.getElementById('register-form').reset();
    } else {
      app.showToast(result.message, 'error');
    }
  }

  // Đăng xuất tài khoản
  function logout() {
    currentUser = null;
    localStorage.removeItem('shoppulse_current_user');
    updateHeaderUserUI();
    app.closeModal('profile-modal');
    app.showToast('Đã đăng xuất tài khoản.', 'info');
  }

  // Gắn sự kiện cho các form
  function bindEvents() {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
    if (regForm) regForm.addEventListener('submit', handleRegisterSubmit);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
  }

  return {
    initAuth,
    switchTab,
    getCurrentUser: () => currentUser,
    setCurrentUser: (u) => {
      currentUser = u;
      localStorage.setItem('shoppulse_current_user', JSON.stringify(currentUser));
      updateHeaderUserUI();
    },
    logout,
    bindEvents
  };
})();
