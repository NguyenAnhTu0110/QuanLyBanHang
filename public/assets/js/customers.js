(() => {
  const resource = "customers";
  const tableBody = document.getElementById("customerTableBody");
  let customers = []; // Đóng vai trò như Local State

  const toAddressText = (address) =>
    [
      address.addressDetail,
      address.wardName,
      address.districtName,
      address.provinceName,
    ]
      .filter(Boolean)
      .join(", ");

  const renderStatus = (status) =>
    status === "active"
      ? app.badge("Đang hoạt động", "success")
      : app.badge("Tạm khóa", "danger");

  const renderTable = () => {
    if (!customers.length) {
      tableBody.innerHTML = app.renderEmptyRow(6, "Chưa có khách hàng nào.");
      return;
    }

    tableBody.innerHTML = customers
      .map((customer) => {
        const primaryAddress =
          Array.isArray(customer.addresses) && customer.addresses.length
            ? customer.addresses[0]
            : null;
        const displayAddress = primaryAddress
          ? toAddressText(primaryAddress)
          : customer.address || "Chưa có địa chỉ";

        // Thêm thẻ <td> chứa nút Xóa ở cuối. 
        // Gắn data-id và data-name để lấy thông tin khi click
        return `
          <tr>
            <td>
              <strong>${app.escapeHtml(customer.fullName)}</strong><br />
              <span class="muted">${app.escapeHtml(displayAddress)}</span>
            </td>
            <td>${app.escapeHtml(customer.email)}</td>
            <td>${app.escapeHtml(customer.phone)}</td>
            <td>${app.escapeHtml(customer.city || "--")}</td>
            <td>${renderStatus(customer.status)}</td>
            <td>
              <button class="btn btn-danger btn-sm delete-btn" data-id="${customer._id}" data-name="${app.escapeHtml(customer.fullName)}">
                Xóa
              </button>
            </td>
          </tr>
        `;
      })
      .join("");
  };

  const loadCustomers = async () => {
    try {
      const response = await api.list(resource);
      customers = response.data || [];
      renderTable();
    } catch (error) {
      app.showToast(error.message, "error");
      tableBody.innerHTML = app.renderEmptyRow(6, "Không tải được khách hàng.");
    }
  };

  // Core logic xử lý Xóa
  const handleDelete = async (id, name) => {
    // 1. Validate UX: Luôn confirm trước hành động phá hủy dữ liệu
    if (!confirm(`Bạn có chắc chắn muốn xóa khách hàng "${name}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      // 2. Gọi API (Giả định module api đã có method delete)
      await api.remove(resource, id);
      
      // 3. Thông báo thành công
      app.showToast("Đã xóa khách hàng thành công", "success");
      
      // 4. Cập nhật Local State và Render lại (Tối ưu: Không gọi lại loadCustomers)
      customers = customers.filter(c => c._id !== id);
      renderTable();
      
    } catch (error) {
      console.error("Delete error:", error);
      app.showToast(error.message || "Lỗi hệ thống: Không thể xóa khách hàng", "error");
    }
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const user = await auth.protectPage({ roles: ["admin"] });

    if (!user) {
      return;
    }
    
    await loadCustomers();

    // 5. Event Delegation: Lắng nghe sự kiện click trên toàn bộ Table Body
    tableBody.addEventListener("click", (e) => {
      // Tìm element gần nhất có class .delete-btn (phòng trường hợp click vào icon bên trong button)
      const deleteBtn = e.target.closest(".delete-btn");
      
      if (deleteBtn) {
        // Lấy payload từ dataset và trigger action
        const customerId = deleteBtn.dataset.id;
        const customerName = deleteBtn.dataset.name;
        handleDelete(customerId, customerName);
      }
    });
  });
})();