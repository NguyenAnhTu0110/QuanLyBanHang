(() => {
  const productsGrid = document.getElementById("shopProductsGrid");

  const renderProducts = (products) => {
    if (!products.length) {
      productsGrid.innerHTML =
        '<div class="store-empty">Chưa có sản phẩm nào đang mở bán.</div>';
      return;
    }

    productsGrid.innerHTML = products
      .map((product) => {
        // Ưu tiên hình ảnh uploaded, nếu không có thì dùng imageUrl
        const imageSrc = product.image || product.imageUrl;
        const image = imageSrc
          ? `<img src="${app.escapeHtml(imageSrc)}" alt="${app.escapeHtml(
              product.name
            )}" />`
          : `<span>${app.escapeHtml(product.name)}</span>`;

        return `
          <article class="product-card">
            <div class="product-image">${image}</div>
            <div>
              <p class="eyebrow">Sản phẩm</p>
              <h3>${app.escapeHtml(product.name)}</h3>
              <p>${app.escapeHtml(product.description || "Chưa có mô tả cho sản phẩm này.")}</p>
            </div>
            <div class="product-meta">
              <span class="meta-pill">${app.escapeHtml(product.category?.name || "Chưa phân loại")}</span>
              <span class="meta-pill">Tồn kho: ${app.escapeHtml(product.stock)}</span>
            </div>
            <div class="price-line">
              <strong>${app.formatCurrency(product.price)}</strong>
              ${product.stock > 0 ? app.badge("Còn hàng", "success") : app.badge("Hết hàng", "danger")}
            </div>
          </article>
        `;
      })
      .join("");
  };

  const loadProducts = async () => {
    try {
      const response = await api.storeProducts();
      renderProducts(response.data || []);
    } catch (error) {
      app.showToast(error.message, "error");
      productsGrid.innerHTML =
        '<div class="store-empty">Không tải được dữ liệu sản phẩm.</div>';
    }
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const user = await auth.protectPage({ roles: ["user"] });

    if (!user) {
      return;
    }

    await loadProducts();
  });
})();
