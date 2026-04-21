(() => {
  const resource = "orders";
  const tableBody = document.getElementById("orderTableBody");
  const filterSelect = document.getElementById("orderStatusFilter");
  const filterResultInfo = document.getElementById("orderFilterResultInfo");
  const filterResultText = document.getElementById("orderFilterResultText");

  let orders = [];

  const STATUS_LABELS = {
    preparing: "Đang chuẩn bị",
    shipping:  "Đang giao",
    success:   "Thành công",
    cancelled: "Hủy hàng",
  };

  const paymentMethodLabels = {
    cod: "Tiền mặt",
    bank_transfer: "Chuyển khoản",
    momo: "Ví Momo",
    card: "Thẻ ngân hàng",
  };

  const paymentStatusConfig = {
    pending:  ["Chưa thanh toán", "warning"],
    received: ["Đã thanh toán",   "success"],
  };

  const renderPaymentStatus = (status) => {
    const [label, variant] = paymentStatusConfig[status] || [status || "Khác", "neutral"];
    return app.badge(label, variant);
  };

  const icons = {
    preparing: `<svg viewBox="0 0 24 24" fill="none" stroke="#ca8a04" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>`,
    shipping:  `<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><path d="M8 7h12m0 0l3 5v5h-3m-9 0H5m14 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0m-9 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0m-4-4v-4a2 2 0 012-2h4"></path></svg>`,
    success:   `<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    cancelled: `<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
  };

  const renderOrderRow = (order) => {
    const customerName  = order.customer?.fullName || "Khác";
    const productNames  = (order.items || []).map((i) => i.productName).filter(Boolean).join(", ");
    const paymentMethod = paymentMethodLabels[order.paymentMethod] || order.paymentMethod;
    const isNonCOD      = order.paymentMethod !== "cod";
    const paymentStatusCell = isNonCOD
      ? renderPaymentStatus(order.paymentStatus || "pending")
      : "Chưa thanh toán";

    const deliveryControl = `
      <div class="custom-dropdown" data-order-id="${order._id}">
        <div class="dropdown-trigger">
          <span class="trigger-content">
            ${icons[order.status] || ""}
            <span class="text-${order.status}">${STATUS_LABELS[order.status] || "Chưa rõ"}</span>
          </span>
          <span class="arrow-down">▼</span>
        </div>
        <ul class="dropdown-menu">
          <li data-value="preparing">${icons.preparing} <span class="text-preparing">Đang chuẩn bị</span></li>
          <li data-value="shipping">${icons.shipping}   <span class="text-shipping">Đang giao</span></li>
          <li data-value="success">${icons.success}     <span class="text-success">Thành công</span></li>
          <li data-value="cancelled">${icons.cancelled} <span class="text-cancelled">Hủy hàng</span></li>
        </ul>
      </div>
    `;

    const paymentActionButton = isNonCOD
      ? `<button class="btn btn-secondary btn-sm" data-toggle-payment-status="${order._id}">
           ${order.paymentStatus === "received" ? "X" : "✓"}
         </button>`
      : "";

    return `
      <tr data-order-id="${order._id}">
        <td><code>${app.escapeHtml(order.orderCode)}</code></td>
        <td>${app.escapeHtml(customerName)}</td>
        <td>${app.escapeHtml(productNames || `${order.items?.length || 0} sản phẩm`)}</td>
        <td><strong>${app.formatCurrency(order.totalAmount)}</strong></td>
        <td>${app.escapeHtml(paymentMethod)}</td>
        <td>${deliveryControl}</td>
        <td>
          <div class="payment-cell">
            ${paymentStatusCell}
            ${paymentActionButton}
          </div>
        </td>
        <td>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${order._id}" data-code="${app.escapeHtml(order.orderCode)}">
            Xóa
          </button>
        </td>
      </tr>
    `;
  };

  // ──────────────────────────────────────────────
  // Render bảng — áp dụng filter trạng thái
  // ──────────────────────────────────────────────
  const renderOrders = () => {
    const filterValue = filterSelect.value;

    const filtered = filterValue
      ? orders.filter((o) => o.status === filterValue)
      : orders;

    // Thông tin kết quả lọc
    if (filterValue) {
      const statusLabel = STATUS_LABELS[filterValue] || filterValue;
      filterResultInfo.style.display = "block";
      filterResultText.textContent = `Hiển thị ${filtered.length} đơn hàng có trạng thái "${statusLabel}"`;
    } else {
      filterResultInfo.style.display = "none";
    }

    if (!filtered.length) {
      tableBody.innerHTML = `<tr><td colspan="8" class="empty-cell">${
        filterValue ? "Không có đơn hàng nào với trạng thái này." : "Chưa có đơn hàng nào."
      }</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(renderOrderRow).join("");

    // Gắn event cho nút toggle thanh toán
    tableBody.querySelectorAll("[data-toggle-payment-status]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const orderId = btn.dataset.togglePaymentStatus;
        const order = orders.find((o) => o._id === orderId);
        if (order) await updatePaymentStatus(orderId, order.paymentStatus || "pending");
      });
    });
  };

  const updatePaymentStatus = async (orderId, currentStatus) => {
    const newStatus   = currentStatus === "pending" ? "received" : "pending";
    const statusLabel = newStatus === "pending" ? "Chưa thanh toán" : "Đã thanh toán";

    if (!confirm(`Xác nhận cập nhật trạng thái thanh toán thành: ${statusLabel}?`)) return;

    try {
      await api.updateOrderPaymentStatus(orderId, newStatus);
      app.showToast("Cập nhật trạng thái thanh toán thành công");
      await loadOrders();
    } catch (error) {
      app.showToast(error.message || "Lỗi cập nhật trạng thái", "error");
    }
  };

  const updateSummary = () => {
    document.getElementById("ordersTotalCount").textContent     = orders.length;
    document.getElementById("ordersPendingCount").textContent   = orders.filter((o) => o.status === "preparing").length;
    document.getElementById("ordersShippingCount").textContent  = orders.filter((o) => o.status === "shipping").length;
    document.getElementById("ordersCompletedCount").textContent = orders.filter((o) => o.status === "success").length;
    document.getElementById("ordersCancelledCount").textContent = orders.filter((o) => o.status === "cancelled").length;
  };

  // Core logic xử lý Xóa đơn hàng
  const handleDeleteOrder = async (id, code) => {
    // 1. Validate UX: Luôn confirm trước hành động phá hủy dữ liệu
    if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng "${code}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      // 2. Gọi API
      await api.remove(resource, id);
      
      // 3. Thông báo thành công
      app.showToast("Đã xóa đơn hàng thành công", "success");
      
      // 4. Cập nhật Local State và Render lại
      orders = orders.filter(o => o._id !== id);
      renderOrders();
      updateSummary();
      
    } catch (error) {
      console.error("Delete error:", error);
      app.showToast(error.message || "Lỗi hệ thống: Không thể xóa đơn hàng", "error");
    }
  };

  const loadOrders = async () => {
    try {
      const response = await api.list(resource);
      orders = response.data || [];
      renderOrders();
      updateSummary();
    } catch (error) {
      app.showToast(error.message || "Lỗi tải danh sách đơn", "error");
      tableBody.innerHTML = '<tr><td colspan="8" class="empty-cell">Không thể tải dữ liệu.</td></tr>';
    }
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const user = await auth.protectPage({ roles: ["admin"] });
    if (!user) return;

    // Filter change → re-render (không gọi API lại)
    filterSelect.addEventListener("change", renderOrders);

    // Event delegation cho custom delivery dropdown trong bảng
    tableBody.addEventListener("click", async (event) => {
      // Xử lý nút xóa
      const deleteBtn = event.target.closest(".delete-btn");
      if (deleteBtn) {
        const orderId = deleteBtn.dataset.id;
        const orderCode = deleteBtn.dataset.code;
        handleDeleteOrder(orderId, orderCode);
        return;
      }

      const trigger = event.target.closest(".dropdown-trigger");
      if (trigger) {
        const dropdown = trigger.closest(".custom-dropdown");
        document.querySelectorAll(".custom-dropdown.active").forEach((d) => {
          if (d !== dropdown) d.classList.remove("active");
        });
        dropdown.classList.toggle("active");
        return;
      }

      const optionItem = event.target.closest(".dropdown-menu li");
      if (optionItem) {
        const dropdown  = optionItem.closest(".custom-dropdown");
        const orderId   = dropdown.dataset.orderId;
        const newStatus = optionItem.dataset.value;
        dropdown.classList.remove("active");
        try {
          await api.updateOrderDeliveryStatus(orderId, newStatus);
          app.showToast("Cập nhật trạng thái giao hàng thành công");
          await loadOrders();
        } catch (error) {
          app.showToast(error.message || "Không thể cập nhật trạng thái giao hàng", "error");
          await loadOrders();
        }
      }
    });

    // Đóng delivery dropdown khi click ra ngoài
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".custom-dropdown")) {
        document.querySelectorAll(".custom-dropdown.active").forEach((d) => d.classList.remove("active"));
      }
    });

    await loadOrders();
  });
})();