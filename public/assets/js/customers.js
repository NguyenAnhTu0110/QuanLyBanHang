(() => {
  const resource = "customers";
  const tableBody = document.getElementById("customerTableBody");
  let customers = [];

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
      .map(
        (customer) => {
          const primaryAddress =
            Array.isArray(customer.addresses) && customer.addresses.length
              ? customer.addresses[0]
              : null;
          const displayAddress = primaryAddress
            ? toAddressText(primaryAddress)
            : customer.address || "Chưa có địa chỉ";

          return `
          <tr>
            <td>
              <strong>${app.escapeHtml(customer.fullName)}</strong><br />
              <span class="muted">${app.escapeHtml(displayAddress || "Chưa có địa chỉ")}</span>
            </td>
            <td>${app.escapeHtml(customer.email)}</td>
            <td>${app.escapeHtml(customer.phone)}</td>
            <td>${app.escapeHtml(customer.city || "--")}</td>
            <td>${renderStatus(customer.status)}</td>
            <td><span class="muted">Tự động đồng bộ</span></td>
          </tr>
        `;
        }
      )
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

  document.addEventListener("DOMContentLoaded", async () => {
    const user = await auth.protectPage({ roles: ["admin"] });

    if (!user) {
      return;
    }
    await loadCustomers();
  });
})();
