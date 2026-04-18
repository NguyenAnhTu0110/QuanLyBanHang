(() => {
  const resource = "orders";
  const tableBody = document.getElementById("orderTableBody");
  let orders = [];

  const paymentMethodLabels = {
    cod: "COD",
    bank_transfer: "Chuyển khoản",
    momo: "MoMo",
    card: "Thẻ ngân hàng",
  };

  const orderStatusConfig = {
    pending: ["Chờ xử lý", "warning"],
    confirmed: ["Đã xác nhận", "neutral"],
    shipping: ["Đang giao", "warning"],
    completed: ["Hoàn thành", "success"],
    cancelled: ["Đã hủy", "danger"],
  };

  const paymentStatusConfig = {
    pending: ["Chưa thanh toán", "warning"],
    received: ["Đã thanh toán", "success"],
  };

  const renderOrderStatus = (status) => {
    const [label, variant] = orderStatusConfig[status] || [status || "Khác", "neutral"];
    return app.badge(label, variant);
  };

  const renderPaymentStatus = (status) => {
    const [label, variant] = paymentStatusConfig[status] || [status || "Khác", "neutral"];
    return app.badge(label, variant);
  };

  const renderOrderRow = (order) => {
    const customerName = order.customer?.fullName || "Khác";
    const itemCount = order.items?.length || 0;
    const paymentMethod = paymentMethodLabels[order.paymentMethod] || order.paymentMethod;
    
    // Show payment status update button only for non-COD orders
    const isNonCOD = order.paymentMethod !== "cod";
    const paymentStatusCell = isNonCOD
      ? `${renderPaymentStatus(order.paymentStatus || "pending")}`
      : app.badge("N/A", "neutral");

    const actionButtons = isNonCOD
      ? `<button class="btn btn-secondary btn-sm" data-toggle-payment-status="${order._id}">
           Cập nhật TT
         </button>`
      : `<button class="btn btn-secondary btn-sm" disabled>Không cần</button>`;

    return `
      <tr data-order-id="${order._id}">
        <td><code>${app.escapeHtml(order.orderCode)}</code></td>
        <td>${app.escapeHtml(customerName)}</td>
        <td>${itemCount} sản phẩm</td>
        <td><strong>${app.formatCurrency(order.totalAmount)}</strong></td>
        <td>${app.escapeHtml(paymentMethod)}</td>
        <td>${renderOrderStatus(order.status)}</td>
        <td>${paymentStatusCell}</td>
        <td>${actionButtons}</td>
      </tr>
    `;
  };

  const updatePaymentStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "received" : "pending";
    const statusLabel = newStatus === "pending" ? "Chưa thanh toán" : "Đã thanh toán";
    
    if (!confirm(`Xác nhận cập nhật trạng thái thanh toán thành: ${statusLabel}?`)) {
      return;
    }

    try {
      await api.updateOrderPaymentStatus(orderId, newStatus);
      app.showToast("Cập nhật trạng thái thanh toán thành công");
      loadOrders();
    } catch (error) {
      app.showToast(error.message || "Lỗi cập nhật trạng thái", "error");
    }
  };

  const renderOrders = (orders) => {
    if (!orders.length) {
      tableBody.innerHTML = '<tr><td colspan="8" class="empty-cell">Chưa có đơn hàng nào.</td></tr>';
      return;
    }

    tableBody.innerHTML = orders.map(renderOrderRow).join("");

    // Add event listeners for payment status update buttons
    tableBody.querySelectorAll("[data-toggle-payment-status]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const orderId = btn.dataset.togglePaymentStatus;
        const order = orders.find((o) => o._id === orderId);
        if (order) {
          await updatePaymentStatus(orderId, order.paymentStatus || "pending");
        }
      });
    });
  };

  const updateSummary = (orders) => {
    const totalCount = orders.length;
    const pendingCount = orders.filter((o) => o.status === "pending").length;
    const completedCount = orders.filter((o) => o.status === "completed").length;

    document.getElementById("ordersTotalCount").textContent = totalCount;
    document.getElementById("ordersPendingCount").textContent = pendingCount;
    document.getElementById("ordersCompletedCount").textContent = completedCount;
  };

  const loadOrders = async () => {
    try {
      const response = await api.list(resource);
      orders = response.data || [];
      renderOrders(orders);
      updateSummary(orders);
    } catch (error) {
      app.showToast(error.message || "Lỗi tải danh sách đơn", "error");
      tableBody.innerHTML = '<tr><td colspan="8" class="empty-cell">Không thể tải dữ liệu.</td></tr>';
    }
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const user = await auth.protectPage({ roles: ["admin"] });

    if (!user) {
      return;
    }

    await loadOrders();
  });
})();
