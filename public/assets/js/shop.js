(() => {
  const productsGrid = document.getElementById("shopProductsGrid");
  let currentUser = null;
  let currentCustomer = {};
  let allProducts = [];

  const showCheckoutModal = async (product) => {
    try {
      const customerData = await api.getCustomer();
      currentCustomer = customerData.data || {};

      // Nếu chưa có thông tin, hiển thị form cập nhật (kèm theo sản phẩm để đặt hàng sau đó)
      if (!currentCustomer.fullName || !currentCustomer.address) {
        showAddressUpdateModal(product);
        return;
      }

      showOrderConfirmation(product);
    } catch (error) {
      app.showToast(error.message || "Không thể lấy thông tin khách hàng", "error");
    }
  };

  const loadAddressData = async () => {
    try {
      const [tinhTpRes, quanHuyenRes, xaPhuongRes] = await Promise.all([
        fetch("/assets/data/tinh_tp.json").then(r => r.json()),
        fetch("/assets/data/quan_huyen.json").then(r => r.json()),
        fetch("/assets/data/xa_phuong.json").then(r => r.json()),
      ]);
      return {
        provinces: tinhTpRes,
        districts: quanHuyenRes,
        wards: xaPhuongRes,
      };
    } catch (error) {
      console.error("Lỗi tải dữ liệu địa chỉ:", error);
      return null;
    }
  };

 const showAddressUpdateModal = async (product = null) => {
    const addressData = await loadAddressData();
    if (!addressData) {
      app.showToast("Không tải được dữ liệu địa chỉ", "error");
      return;
    }

    const { provinces: provinceData, districts: districtData, wards: wardData } = addressData;

    const title = product 
        ? "Vui lòng cập nhật thông tin cá nhân trước khi mua" 
        : "Cập nhật thông tin giao hàng cá nhân";

    const modalContent = `
      <div style="padding: 20px; background: white; border-radius: 8px; max-width: 500px; margin: 0 auto; max-height: 85vh; overflow-y: auto;">
        <p class="eyebrow">Cập nhật thông tin</p>
        <h2>${title}</h2>

        <form id="addressUpdateForm" style="margin-top: 20px;">
          <div class="form-grid" style="display: grid; grid-template-columns: 1fr; gap: 12px;">
            <div class="field full" style="display: flex; flex-direction: column; gap: 6px;">
              <label for="updateFullName" style="font-size: 0.9em; font-weight: 600;">Họ và tên</label>
              <input id="updateFullName" name="fullName" type="text" placeholder="Ví dụ: Nguyễn Anh Tú" value="${currentCustomer.fullName || ''}" style="padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9em;" required />
            </div>

            <div class="field full" style="display: flex; flex-direction: column; gap: 6px;">
              <label for="updateProvince" style="font-size: 0.9em; font-weight: 600;">Tỉnh/Thành phố</label>
              <select id="updateProvince" name="provinceName" style="padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9em;" required>
                <option value="">-- Chọn Tỉnh/Thành phố --</option>
              </select>
            </div>

            <div class="field full" style="display: flex; flex-direction: column; gap: 6px;">
              <label for="updateDistrict" style="font-size: 0.9em; font-weight: 600;">Quận/Huyện</label>
              <select id="updateDistrict" name="districtName" style="padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9em;" required>
                <option value="">-- Vui lòng chọn Tỉnh/Thành phố trước --</option>
              </select>
            </div>

            <div class="field full" style="display: flex; flex-direction: column; gap: 6px;">
              <label for="updateWard" style="font-size: 0.9em; font-weight: 600;">Phường/Xã</label>
              <select id="updateWard" name="wardName" style="padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9em;" required>
                <option value="">-- Vui lòng chọn Quận/Huyện trước --</option>
              </select>
            </div>

            <div class="field full" style="display: flex; flex-direction: column; gap: 6px;">
              <label for="updateStreetNumber" style="font-size: 0.9em; font-weight: 600;">Số nhà, tòa nhà</label>
              <input id="updateStreetNumber" name="streetNumber" type="text" placeholder="Ví dụ: 123" value="${currentCustomer.streetNumber || ''}" style="padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9em;" required />
            </div>

            <div class="field full" style="display: flex; flex-direction: column; gap: 6px;">
              <label for="updateStreetName" style="font-size: 0.9em; font-weight: 600;">Tên đường</label>
              <input id="updateStreetName" name="streetName" type="text" placeholder="Ví dụ: Đường Nguyễn Hữu Cảnh" value="${currentCustomer.streetName || ''}" style="padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9em;" required />
            </div>
          </div>

          <div class="button-row" style="margin-top: 16px; gap: 10px; display: flex;">
            <button class="btn btn-primary" type="submit" style="flex: 1; padding: 10px 12px; font-size: 0.9em;">Xác nhận Lưu</button>
            <button class="btn btn-secondary" type="button" onclick="this.closest('.modal-overlay').remove()" style="flex: 1; padding: 10px 12px; font-size: 0.9em;">Hủy</button>
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

    // Lấy dữ liệu Tỉnh
    Object.values(provinceData).forEach((prov) => {
      const option = document.createElement("option");
      option.value = prov.name_with_type;
      option.dataset.code = prov.code; 
      option.textContent = prov.name_with_type;
      provinceSelect.appendChild(option);
    });

    // Lấy dữ liệu Huyện khi đổi Tỉnh
    provinceSelect.addEventListener("change", (e) => {
      const provinceCode = e.target.options[e.target.selectedIndex].dataset.code;
      districtSelect.innerHTML = '<option value="">-- Chọn Quận/Huyện --</option>';
      wardSelect.innerHTML = '<option value="">-- Vui lòng chọn Quận/Huyện trước --</option>';

      if (!provinceCode) return;

      Object.values(districtData).forEach((dist) => {
        if (dist.parent_code === provinceCode) {
          const option = document.createElement("option");
          option.value = dist.name_with_type;
          option.dataset.code = dist.code;
          option.textContent = dist.name_with_type;
          districtSelect.appendChild(option);
        }
      });
    });

    // Lấy dữ liệu Xã khi đổi Huyện
    districtSelect.addEventListener("change", (e) => {
      const districtCode = e.target.options[e.target.selectedIndex].dataset.code;
      wardSelect.innerHTML = '<option value="">-- Chọn Phường/Xã --</option>';

      if (!districtCode) return;

      Object.values(wardData).forEach((ward) => {
        if (ward.parent_code === districtCode) {
          const option = document.createElement("option");
          option.value = ward.name_with_type;
          option.dataset.code = ward.code; // ĐÃ THÊM DÒNG NÀY ĐỂ FIX LỖI
          option.textContent = ward.name_with_type;
          wardSelect.appendChild(option);
        }
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Lấy ID (code) của các địa chỉ được chọn
      const provinceCode = provinceSelect.options[provinceSelect.selectedIndex]?.dataset.code;
      const districtCode = districtSelect.options[districtSelect.selectedIndex]?.dataset.code;
      const wardCode = wardSelect.options[wardSelect.selectedIndex]?.dataset.code;

      // Validate phía FE trước khi gửi
      if (!provinceCode || !districtCode || !wardCode) {
        app.showToast("Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã", "error");
        return;
      }

      try {
        await api.updateCustomer({
          fullName: form.fullName.value,
          provinceId: provinceCode,     // Thêm lại các ID để Backend không chửi
          provinceName: form.provinceName.value,
          districtId: districtCode,     // Thêm lại các ID để Backend không chửi
          districtName: form.districtName.value,
          wardId: wardCode,             // Thêm lại các ID để Backend không chửi
          wardName: form.wardName.value,
          streetNumber: form.streetNumber.value,
          streetName: form.streetName.value,
        });

        modal.remove();
        app.showToast("Cập nhật thông tin thành công");

        const nameSpan = document.querySelector("[data-auth-name]");
        if(nameSpan) {
            nameSpan.textContent = form.fullName.value;
        }

        if (product) {
          showOrderConfirmation(product);
        }

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
              <p><strong>Khách hàng:</strong> ${app.escapeHtml(currentCustomer.fullName || document.querySelector("[data-auth-name]").textContent)}</p>
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
        const product = allProducts.find((p) => p._id === productId);
        if (product) {
          showCheckoutModal(product);
        }
      });
    });
  };

  const loadData = async () => {
    try {
      const productsResponse = await api.storeProducts();
      allProducts = productsResponse.data || [];
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
    
    // Bắt sự kiện cho nút Cập nhật tài khoản mới thêm
    const btnUpdateAccount = document.getElementById("btnUpdateAccount");
    if (btnUpdateAccount) {
      btnUpdateAccount.addEventListener("click", async () => {
        try {
          const customerData = await api.getCustomer();
          currentCustomer = customerData.data || {};
          showAddressUpdateModal(); // Gọi Modal mà không truyền tham số product
        } catch (error) {
          app.showToast("Không thể tải thông tin để cập nhật", "error");
        }
      });
    }

    await loadData();
  });
})();