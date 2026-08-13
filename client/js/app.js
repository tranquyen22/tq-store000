/**
 * Main Application Orchestrator & Global UI Handlers
 * Quản lý Modal, Drawer, Toast Notification và Theme Toggle (Dark/Light)
 */
const app = (() => {

  // Khởi chạy ứng dụng khi DOM sẵn sàng
  function init() {
    initTheme();
    authUI.initAuth();
    productsUI.initProducts();
    cartUI.initCart();
    profileUI.bindEvents();
    authUI.bindEvents();
    bindGlobalEvents();
  }

  // Quản lý Giao diện Tối / Sáng (Dark / Light Theme)
  function initTheme() {
    const savedTheme = localStorage.getItem('shoppulse_theme') || 'light-theme';
    document.body.className = savedTheme;
    updateThemeIcon(savedTheme);

    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        const newTheme = isDark ? 'light-theme' : 'dark-theme';
        document.body.className = newTheme;
        localStorage.setItem('shoppulse_theme', newTheme);
        updateThemeIcon(newTheme);
      });
    }
  }

  function updateThemeIcon(theme) {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;
    if (theme === 'dark-theme') {
      themeBtn.innerHTML = '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>';
      themeBtn.title = "Chuyển sang giao diện Sáng";
    } else {
      themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      themeBtn.title = "Chuyển sang giao diện Tối";
    }
  }

  // Quản lý Modal
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  // Quản lý Slide-out Drawer
  function openDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (drawer) {
      drawer.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (drawer) {
      drawer.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  // Thông báo Toast Notification linh hoạt
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-xmark';

    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Gắn sự kiện toàn cục (Click outside modal để đóng, phím ESC)
  function bindGlobalEvents() {
    // Click Nút Giỏ hàng trên Header
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    if (cartToggleBtn) {
      cartToggleBtn.addEventListener('click', () => openDrawer('cart-drawer'));
    }

    // Click Logo để cuộn lên đầu trang hoặc reset
    const logoBtn = document.getElementById('btn-home-logo');
    if (logoBtn) {
      logoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        productsUI.resetFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Nút mở modal Auth
    const openAuthBtn = document.getElementById('open-auth-btn');
    if (openAuthBtn) {
      openAuthBtn.addEventListener('click', () => openModal('auth-modal'));
    }

    // Click outside modal overlay để đóng
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
      if (e.target.classList.contains('drawer-overlay')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });

    // Bấm phím ESC để đóng mọi Modal / Drawer
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay, .drawer-overlay').forEach(el => {
          el.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
      }
    });
  }

  return {
    init,
    openModal,
    closeModal,
    openDrawer,
    closeDrawer,
    showToast,
    filterByCategory: (catId) => productsUI.filterByCategory(catId)
  };
})();

// Khởi chạy ứng dụng khi DOM tải xong
document.addEventListener('DOMContentLoaded', app.init);
