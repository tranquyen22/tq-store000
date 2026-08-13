/**
 * Product Catalog & Detail View Module
 * Quản lý hiển thị danh sách sản phẩm, Tìm kiếm, Bộ lọc danh mục & khoảng giá
 */
const productsUI = (() => {
  let categories = [];
  let allProducts = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let maxPrice = 50000000;
  let sortBy = 'featured';

  // Format số tiền VNĐ (vd: 32.990.000đ)
  function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  // Khởi tạo tải danh mục & danh sách sản phẩm
  async function initProducts() {
    categories = await API.getCategories();
    renderCategoriesSidebar();
    await loadProducts();
    bindEvents();
  }

  // Render Sidebar danh mục
  function renderCategoriesSidebar() {
    const listEl = document.getElementById('categories-filter-list');
    if (!listEl) return;

    listEl.innerHTML = categories.map(cat => `
      <li>
        <button class="category-item-btn ${cat.id === currentCategory ? 'active' : ''}" data-cat-id="${cat.id}">
          <i class="fa-solid ${cat.icon || 'fa-tag'}"></i>
          <span>${cat.name}</span>
        </button>
      </li>
    `).join('');
  }

  // Tải sản phẩm theo bộ lọc hiện tại
  async function loadProducts() {
    const grid = document.getElementById('products-grid');
    const noProductsView = document.getElementById('no-products-view');
    const countText = document.getElementById('products-count-text');

    if (!grid) return;

    // Loading skeleton placeholder
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i><p style="margin-top: 10px;">Đang tải danh sách sản phẩm...</p></div>';

    allProducts = await API.getProducts({
      q: searchQuery,
      category: currentCategory,
      maxPrice: maxPrice,
      sortBy: sortBy
    });

    if (countText) {
      countText.innerHTML = `Hiển thị <strong>${allProducts.length}</strong> sản phẩm`;
    }

    if (allProducts.length === 0) {
      grid.style.display = 'none';
      if (noProductsView) noProductsView.style.display = 'block';
      return;
    }

    grid.style.display = 'grid';
    if (noProductsView) noProductsView.style.display = 'none';

    renderProductsGrid(allProducts);
    renderActiveFilterTags();
  }

  // Render thẻ sản phẩm (Product Card)
  function renderProductsGrid(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = products.map(p => `
      <div class="product-card">
        <div class="card-image-wrap" onclick="productsUI.openProductDetail('${p.id}')">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ''}
        </div>
        <div class="card-body">
          <span class="card-category">${getCategoryName(p.category)}</span>
          <h4 class="card-title" onclick="productsUI.openProductDetail('${p.id}')">${p.name}</h4>
          <div class="card-rating">
            <i class="fa-solid fa-star"></i>
            <span>${p.rating || 5.0}</span>
            <span class="review-count">(${p.reviewsCount || 0} đánh giá)</span>
          </div>
          <div class="card-price-row">
            <span class="current-price">${formatCurrency(p.price)}</span>
            ${p.originalPrice ? `<span class="original-price">${formatCurrency(p.originalPrice)}</span>` : ''}
          </div>
          <div class="card-actions">
            <button class="btn btn-primary btn-sm btn-add-cart" onclick="cartUI.addToCart('${p.id}')">
              <i class="fa-solid fa-cart-plus"></i> Thêm giỏ hàng
            </button>
            <button class="btn btn-outline btn-sm" onclick="productsUI.openProductDetail('${p.id}')" title="Xem chi tiết">
              <i class="fa-regular fa-eye"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Tên hiển thị của danh mục
  function getCategoryName(catId) {
    const found = categories.find(c => c.id === catId);
    return found ? found.name : catId;
  }

  // Hiển thị các tag lọc đang active
  function renderActiveFilterTags() {
    const activeBox = document.getElementById('active-filters-box');
    const container = document.getElementById('active-tags-container');
    if (!activeBox || !container) return;

    const tags = [];
    if (currentCategory !== 'all') {
      tags.push(`Danh mục: ${getCategoryName(currentCategory)}`);
    }
    if (searchQuery) {
      tags.push(`Từ khóa: "${searchQuery}"`);
    }
    if (maxPrice < 50000000) {
      tags.push(`Giá < ${formatCurrency(maxPrice)}`);
    }

    if (tags.length > 0) {
      activeBox.style.display = 'block';
      container.innerHTML = tags.map(t => `<span class="tag-badge">${t}</span>`).join('');
    } else {
      activeBox.style.display = 'none';
    }
  }

  // Mở Modal Chi Tiết Sản Phẩm
  async function openProductDetail(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const detailContainer = document.getElementById('product-detail-content');
    if (!detailContainer) return;

    let specsHtml = '';
    if (product.specs) {
      specsHtml = `
        <table class="detail-specs-table">
          <tbody>
            ${Object.entries(product.specs).map(([key, val]) => `
              <tr>
                <td>${key}</td>
                <td>${val}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    let reviewsHtml = '';
    if (product.reviews && product.reviews.length > 0) {
      reviewsHtml = `
        <div style="margin-top: 20px;">
          <h4 style="font-size: 1rem; margin-bottom: 10px;"><i class="fa-regular fa-comments"></i> Đánh giá khách hàng (${product.reviews.length})</h4>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${product.reviews.map(r => `
              <div style="background: var(--bg-main); padding: 12px; border-radius: var(--radius-sm); font-size: 0.85rem;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 4px;">
                  <span>${r.userName}</span>
                  <span style="color: var(--warning);"><i class="fa-solid fa-star"></i> ${r.rating}/5</span>
                </div>
                <p style="color: var(--text-muted);">${r.comment}</p>
                <span style="font-size: 0.75rem; color: var(--text-light);">${r.date}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    detailContainer.innerHTML = `
      <div class="detail-img-box">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="detail-info">
        <span class="card-category" style="margin-bottom: 4px;">${getCategoryName(product.category)}</span>
        <h2 class="detail-title">${product.name}</h2>
        
        <div class="card-rating" style="margin-bottom: 12px;">
          <i class="fa-solid fa-star"></i>
          <span><strong>${product.rating}</strong>/5.0 (${product.reviewsCount} đánh giá)</span>
          <span style="margin-left: 12px; color: var(--success); font-weight: 700;">
            <i class="fa-solid fa-circle-check"></i> Còn ${product.inStock} sản phẩm
          </span>
        </div>

        <div class="detail-price-row">
          <span class="detail-price">${formatCurrency(product.price)}</span>
          ${product.originalPrice ? `<span class="original-price" style="font-size: 1.1rem;">${formatCurrency(product.originalPrice)}</span>` : ''}
        </div>

        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px; line-height: 1.6;">${product.description}</p>

        ${specsHtml}

        <div class="quantity-picker">
          <span style="font-weight: 700; font-size: 0.9rem;">Số lượng:</span>
          <button class="qty-btn" onclick="productsUI.changeDetailQty(-1)">-</button>
          <input type="number" id="detail-qty-input" class="qty-input" value="1" min="1" max="${product.inStock}">
          <button class="qty-btn" onclick="productsUI.changeDetailQty(1)">+</button>
        </div>

        <div style="display: flex; gap: 12px; margin-top: auto;">
          <button class="btn btn-gradient btn-block btn-lg" onclick="cartUI.addToCart('${product.id}', parseInt(document.getElementById('detail-qty-input').value)); app.closeModal('product-detail-modal');">
            <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ hàng
          </button>
          <button class="btn btn-primary btn-block btn-lg" onclick="cartUI.addToCart('${product.id}', parseInt(document.getElementById('detail-qty-input').value)); app.closeModal('product-detail-modal'); app.openDrawer('cart-drawer');">
            <i class="fa-solid fa-bolt"></i> Mua ngay
          </button>
        </div>

        ${reviewsHtml}
      </div>
    `;

    app.openModal('product-detail-modal');
  }

  // Tăng/giảm số lượng trong Modal chi tiết
  function changeDetailQty(delta) {
    const input = document.getElementById('detail-qty-input');
    if (!input) return;
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    input.value = val;
  }

  // Đặt lại các bộ lọc
  function resetFilters() {
    currentCategory = 'all';
    searchQuery = '';
    maxPrice = 50000000;
    sortBy = 'featured';

    const searchInput = document.getElementById('search-input');
    const priceSlider = document.getElementById('price-range-slider');
    const priceLabel = document.getElementById('price-range-label');
    const sortSelect = document.getElementById('sort-select');

    if (searchInput) searchInput.value = '';
    if (priceSlider) priceSlider.value = 50000000;
    if (priceLabel) priceLabel.textContent = `Từ 0đ - 50.000.000đ`;
    if (sortSelect) sortSelect.value = 'featured';

    renderCategoriesSidebar();
    loadProducts();
  }

  // Gắn sự kiện các bộ lọc
  function bindEvents() {
    // Event khi click danh mục ở sidebar
    const listEl = document.getElementById('categories-filter-list');
    if (listEl) {
      listEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-item-btn');
        if (btn) {
          currentCategory = btn.dataset.catId;
          renderCategoriesSidebar();
          loadProducts();
        }
      });
    }

    // Event thanh tìm kiếm real-time (Debounce)
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    let timer = null;

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
        clearTimeout(timer);
        timer = setTimeout(() => {
          loadProducts();
        }, 300);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        loadProducts();
      });
    }

    // Event Slider Khoảng Giá
    const priceSlider = document.getElementById('price-range-slider');
    const priceLabel = document.getElementById('price-range-label');
    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        maxPrice = Number(e.target.value);
        if (priceLabel) priceLabel.textContent = `Từ 0đ - ${formatCurrency(maxPrice)}`;
        clearTimeout(timer);
        timer = setTimeout(() => {
          loadProducts();
        }, 300);
      });
    }

    // Event Sắp Xếp
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        loadProducts();
      });
    }

    // Nút reset bộ lọc
    const resetBtn = document.getElementById('reset-filters-btn');
    const clearAllBtn = document.getElementById('btn-clear-all-filters');
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    if (clearAllBtn) clearAllBtn.addEventListener('click', resetFilters);
  }

  return {
    initProducts,
    loadProducts,
    openProductDetail,
    changeDetailQty,
    resetFilters,
    filterByCategory: (catId) => {
      currentCategory = catId;
      renderCategoriesSidebar();
      loadProducts();
    },
    getAllProducts: () => allProducts
  };
})();
