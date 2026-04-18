(() => {
  const productsGrid = document.getElementById("shopProductsGrid");
  let currentUser = null;
  let currentCustomer = null;
  let allProducts = [];
  let provinces = [];
  let districts = {};
  let wards = {};

  const showCheckoutModal = async (product) => {
    // Check customer info
    try {
      const customerData = await api.getCustomer();
      currentCustomer = customerData.data;

      // If customer doesn't have name or address, show update form
      if (!currentCustomer.fullName || !currentCustomer.address) {
        showAddressUpdateModal(product);
        return;
      }

      showOrderConfirmation(product);
    } catch (error) {
      app.showToast(error.message || "Không thể lấy thông tin khách hàng", "error");
    }
  };

  const showAddressUpdateModal = (product) => {
    const modalContent = `
      <div style="padding: 20px; background: white; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <p class="eyebrow">Cập nhật thông tin</p>
        <h2>Vui lòng cập nhật thông tin cá nhân trước khi mua</h2>
        
        <form id="addressUpdateForm" style="margin-top: 20px;">
          <div class="form-grid">
            <div class="field full">
              <label for="updateFullName">Họ và tên</label>
              <input
                id="updateFullName"
                name="fullName"
                type="text"
                placeholder="Nhập họ tên"
                value="${currentCustomer.fullName || ''}"
                required
              />
            </div>

            <div class="field full">
              <label for="updateProvince">Tỉnh/Thành phố</label>
              <select id="updateProvince" name="provinceName" required>
                <option value="">-- Chọn Tỉnh/Thành phố --</option>
              </select>
            </div>

            <div class="field full">
              <label for="updateDistrict">Quận/Huyện</label>
              <select id="updateDistrict" name="districtName" required>
                <option value="">-- Vui lòng chọn Tỉnh/Thành phố trước --</option>
              </select>
            </div>

            <div class="field full">
              <label for="updateWard">Phường/Xã</label>
              <select id="updateWard" name="wardName" required>
                <option value="">-- Vui lòng chọn Quận/Huyện trước --</option>
              </select>
            </div>

            <div class="field full">
              <label for="updateStreetNumber">Số nhà</label>
              <input
                id="updateStreetNumber"
                name="streetNumber"
                type="text"
                placeholder="Ví dụ: 123"
                value="${currentCustomer.streetNumber || ''}"
                required
              />
            </div>

            <div class="field full">
              <label for="updateStreetName">Tên đường</label>
              <input
                id="updateStreetName"
                name="streetName"
                type="text"
                placeholder="Ví dụ: Nguyễn Hữu Cảnh"
                value="${currentCustomer.streetName || ''}"
                required
              />
            </div>
          </div>

          <div class="button-row" style="margin-top: 20px;">
            <button class="btn btn-primary" type="submit">Lưu và tiếp tục</button>
            <button class="btn btn-secondary" type="button" onclick="location.reload()">Hủy</button>
          </div>
        </form>
      </div>
    `;

    const modal = createModal("Cập nhật địa chỉ", modalContent);
    document.body.appendChild(modal);

    const form = document.getElementById("addressUpdateForm");
    const provinceSelect = document.getElementById("updateProvince");
    const districtSelect = document.getElementById("updateDistrict");
    const wardSelect = document.getElementById("updateWard");

    // Populate provinces
    provinces.forEach((prov) => {
      const option = document.createElement("option");
      option.value = prov.name;
      option.dataset.id = prov.id;
      option.textContent = prov.name;
      provinceSelect.appendChild(option);
    });

    // Handle province change
    provinceSelect.addEventListener("change", async (e) => {
      const provinceId = e.target.options[e.target.selectedIndex].dataset.id;
      districtSelect.innerHTML = '<option value="">-- Chọn Quận/Huyện --</option>';
      wardSelect.innerHTML = '<option value="">-- Vui lòng chọn Quận/Huyện trước --</option>';

      if (!provinceId) return;

      try {
        const districtData = await api.getDistricts(provinceId);
        districtData.data.forEach((dist) => {
          const option = document.createElement("option");
          option.value = dist.name;
          option.dataset.id = dist.id;
          option.textContent = dist.name;
          districtSelect.appendChild(option);
        });
      } catch (error) {
        app.showToast("Lỗi khi tải danh sách quận/huyện", "error");
      }
    });

    // Handle district change
    districtSelect.addEventListener("change", async (e) => {
      const districtId = e.target.options[e.target.selectedIndex].dataset.id;
      wardSelect.innerHTML = '<option value="">-- Chọn Phường/Xã --</option>';

      if (!districtId) return;

      try {
        const wardData = await api.getWards(districtId);
        wardData.data.forEach((ward) => {
          const option = document.createElement("option");
          option.value = ward.name;
          option.textContent = ward.name;
          wardSelect.appendChild(option);
        });
      } catch (error) {
        app.showToast("Lỗi khi tải danh sách phường/xã", "error");
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        await api.updateCustomer({
          fullName: form.fullName.value,
          provinceName: form.provinceName.value,
          districtName: form.districtName.value,
          wardName: form.wardName.value,
          streetNumber: form.streetNumber.value,
          streetName: form.streetName.value,
        });

        modal.remove();
        app.showToast("Cập nhật thông tin thành công");
        showOrderConfirmation(product);
      } catch (error) {
        app.showToast(error.message || "Lỗi cập nhật thông tin", "error");
      }
    });
  };

  const showOrderConfirmation = (product) => {
    const modalContent = `
      <div style="padding: 20px; background: white; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <p class="eyebrow">Xác nhận đơn hàng</p>
        <h2>${app.escapeHtml(product.name)}</h2>
        
        <form id="orderForm" style="margin-top: 20px;">
          <div class="form-grid">
            <div class="field full">
              <p><strong>Giá:</strong> ${app.formatCurrency(product.price)}</p>
            </div>

            <div class="field full">
              <label for="orderQuantity">Số lượng</label>
              <input
                id="orderQuantity"
                name="quantity"
                type="number"
                min="1"
                max="${product.stock}"
                value="1"
                required
              />
              <small class="muted">Tồn kho: ${product.stock}</small>
            </div>

            <div class="field full">
              <label for="orderPaymentMethod">Phương thức thanh toán</label>
              <select id="orderPaymentMethod" name="paymentMethod" required>
                <option value="cod">Tiền mặt (COD)</option>
                <option value="bank_transfer">Chuyển khoản</option>
                <option value="momo">Ví MoMo</option>
                <option value="card">Thẻ ngân hàng</option>
              </select>
            </div>

            <div class="field full">
              <label for="orderNote">Ghi chú (tùy chọn)</label>
              <textarea
                id="orderNote"
                name="note"
                placeholder="Ghi chú thêm cho đơn hàng"
                style="height: 100px;"
              ></textarea>
            </div>

            <div class="field full" style="background: #f5f5f5; padding: 12px; border-radius: 4px;">
              <p><strong>Khách hàng:</strong> ${app.escapeHtml(currentCustomer.fullName)}</p>
              <p><strong>Địa chỉ giao hàng:</strong> ${app.escapeHtml(currentCustomer.address)}</p>
            </div>
          </div>

          <div class="button-row" style="margin-top: 20px;">
            <button class="btn btn-primary" type="submit">Đặt hàng</button>
            <button class="btn btn-secondary" type="button" onclick="this.closest('.modal-overlay').remove()">Hủy</button>
          </div>
        </form>
      </div>
    `;

    const modal = createModal("Đặt hàng", modalContent);
    document.body.appendChild(modal);

    const form = document.getElementById("orderForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const quantity = Number(form.quantity.value);
      if (quantity > product.stock) {
        app.showToast("Số lượng vượt quá tồn kho", "error");
        return;
      }

      try {
        const orderData = await api.createOrder({
          items: [
            {
              product: product._id,
              quantity,
            },
          ],
          paymentMethod: form.paymentMethod.value,
          note: form.note.value,
        });

        modal.remove();
        app.showToast("Đặt hàng thành công!");

        setTimeout(() => {
          alert(`Mã đơn hàng: ${orderData.data.orderCode}\nTổng tiền: ${app.formatCurrency(orderData.data.totalAmount)}`);
        }, 500);
      } catch (error) {
        app.showToast(error.message || "Lỗi đặt hàng", "error");
      }
    });
  };

  const createModal = (title, content) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;

    overlay.innerHTML = `
      <div style="width: 100%; max-width: 600px; margin: 20px;">
        ${content}
      </div>
    `;

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });

    return overlay;
  };

  const renderProducts = (products) => {
    if (!products.length) {
      productsGrid.innerHTML =
        '<div class="store-empty">Chưa có sản phẩm nào đang mở bán.</div>';
      return;
    }

    productsGrid.innerHTML = products
      .map((product) => {
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
              ${
                product.stock > 0
                  ? app.badge("Còn hàng", "success")
                  : app.badge("Hết hàng", "danger")
              }
            </div>
            ${
              product.stock > 0
                ? `<button class="btn btn-primary btn-block" data-product-id="${product._id}" style="margin-top: 12px; width: 100%;">Mua hàng</button>`
                : ""
            }
          </article>
        `;
      })
      .join("");

    // Add event listeners to buy buttons
    productsGrid.querySelectorAll('[data-product-id]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const productId = btn.dataset.productId;
        const product = products.find((p) => p._id === productId);
        if (product) {
          showCheckoutModal(product);
        }
      });
    });
  };

  const loadData = async () => {
    try {
      const [productsResponse, provincesResponse] = await Promise.all([
        api.storeProducts(),
        api.getProvinces(),
      ]);

      allProducts = productsResponse.data || [];
      provinces = provincesResponse.data || [];
      renderProducts(allProducts);
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

    currentUser = user;
    await loadData();
  });
})();
