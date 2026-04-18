(() => {
  const statusBadge = (status) => {
    const config = {
      preparing: ["Đang chuẩn bị", "warning"],
      shipping: ["Đang giao", "warning"],
      success: ["Thành công", "success"],
      cancelled: ["Hủy hàng", "danger"],
    };

    const [label, variant] = config[status] || [status || "Khác", "neutral"];
    return app.badge(label, variant);
  };

  const renderRecentOrders = (orders) => {
    const tableBody = document.getElementById("recentOrdersBody");

    if (!orders.length) {
      tableBody.innerHTML = app.renderEmptyRow(5, "Chưa có đơn hàng nào.");
      return;
    }

    tableBody.innerHTML = orders
      .map(
        (order) => `
          <tr>
            <td><strong>${app.escapeHtml(order.orderCode)}</strong></td>
            <td>${app.escapeHtml(order.customer?.fullName || "Khách lẻ")}</td>
            <td>${app.formatCurrency(order.totalAmount)}</td>
            <td>${statusBadge(order.status)}</td>
            <td>${app.formatDate(order.createdAt)}</td>
          </tr>
        `
      )
      .join("");
  };

  const renderLowStock = (products) => {
    const list = document.getElementById("lowStockList");
    const countElement = document.getElementById("lowStockCount");

    countElement.textContent = `${products.length} sản phẩm`;

    if (!products.length) {
      list.innerHTML = "<li>Không có sản phẩm nào cảnh báo tồn kho.</li>";
      return;
    }

    list.innerHTML = products
      .map(
        (product) => `
          <li>
            <strong>${app.escapeHtml(product.name)}</strong><br />
            Còn ${app.escapeHtml(product.stock)} sản phẩm trong kho
            ${product.category?.name ? `- Danh mục ${app.escapeHtml(product.category.name)}` : ""}
          </li>
        `
      )
      .join("");
  };

  const loadDashboard = async () => {
    try {
      const response = await api.dashboardStats();
      const { counts, totalRevenue, recentOrders, lowStockProducts } = response.data;

      document.getElementById("totalRevenue").textContent =
        app.formatCurrency(totalRevenue);
      document.getElementById("countCategories").textContent = counts.categories;
      document.getElementById("countProducts").textContent = counts.products;
      document.getElementById(
        "countCustomersOrders"
      ).textContent = `${counts.customers} / ${counts.orders}`;

      renderRecentOrders(recentOrders || []);
      renderLowStock(lowStockProducts || []);
    } catch (error) {
      app.showToast(error.message, "error");
      document.getElementById("recentOrdersBody").innerHTML = app.renderEmptyRow(
        5,
        "Không tải được dữ liệu dashboard."
      );
      document.getElementById("lowStockList").innerHTML =
        "<li>Không tải được cảnh báo tồn kho.</li>";
    }
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const user = await auth.protectPage({ roles: ["admin"] });

    if (!user) {
      return;
    }

    await loadDashboard();
  });
})();
