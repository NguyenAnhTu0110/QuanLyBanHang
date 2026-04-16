(() => {
  const resource = "customers";
  const form = document.getElementById("customerForm");
  const tableBody = document.getElementById("customerTableBody");
  const formTitle = document.getElementById("customerFormTitle");
  const submitButton = document.getElementById("customerSubmitButton");
  const cancelButton = document.getElementById("customerCancelButton");
  let editingId = null;
  let customers = [];

  const renderStatus = (status) =>
    status === "active"
      ? app.badge("Đang hoạt động", "success")
      : app.badge("Tạm khóa", "danger");

  const resetForm = () => {
    editingId = null;
    form.reset();
    form.status.value = "active";
    formTitle.textContent = "Thêm khách hàng mới";
    submitButton.textContent = "Lưu khách hàng";
  };

  const renderTable = () => {
    if (!customers.length) {
      tableBody.innerHTML = app.renderEmptyRow(6, "Chưa có khách hàng nào.");
      return;
    }

    tableBody.innerHTML = customers
      .map(
        (customer) => `
          <tr>
            <td>
              <strong>${app.escapeHtml(customer.fullName)}</strong><br />
              <span class="muted">${app.escapeHtml(customer.address || "Chưa có địa chỉ")}</span>
            </td>
            <td>${app.escapeHtml(customer.email)}</td>
            <td>${app.escapeHtml(customer.phone)}</td>
            <td>${app.escapeHtml(customer.city || "--")}</td>
            <td>${renderStatus(customer.status)}</td>
            <td>
              <div class="actions">
                <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${customer._id}">Sửa</button>
                <button class="btn btn-danger btn-sm" data-action="delete" data-id="${customer._id}">Xóa</button>
              </div>
            </td>
          </tr>
        `
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

  const fillForm = (customer) => {
    editingId = customer._id;
    form.fullName.value = customer.fullName || "";
    form.phone.value = customer.phone || "";
    form.email.value = customer.email || "";
    form.city.value = customer.city || "";
    form.address.value = customer.address || "";
    form.notes.value = customer.notes || "";
    form.status.value = customer.status || "active";
    formTitle.textContent = `Cập nhật: ${customer.fullName}`;
    submitButton.textContent = "Cập nhật khách hàng";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      fullName: form.fullName.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      city: form.city.value.trim(),
      address: form.address.value.trim(),
      notes: form.notes.value.trim(),
      status: form.status.value,
    };

    try {
      if (editingId) {
        await api.update(resource, editingId, payload);
        app.showToast("Cập nhật khách hàng thành công.");
      } else {
        await api.create(resource, payload);
        app.showToast("Thêm khách hàng thành công.");
      }

      resetForm();
      await loadCustomers();
    } catch (error) {
      app.showToast(error.message, "error");
    }
  });

  tableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
      return;
    }

    const customer = customers.find((item) => item._id === button.dataset.id);

    if (!customer) {
      return;
    }

    if (button.dataset.action === "edit") {
      fillForm(customer);
      return;
    }

    if (
      button.dataset.action === "delete" &&
      app.confirmDelete(`Xóa khách hàng "${customer.fullName}"?`)
    ) {
      try {
        await api.remove(resource, customer._id);
        app.showToast("Đã xóa khách hàng.");
        if (editingId === customer._id) {
          resetForm();
        }
        await loadCustomers();
      } catch (error) {
        app.showToast(error.message, "error");
      }
    }
  });

  cancelButton.addEventListener("click", resetForm);

  document.addEventListener("DOMContentLoaded", async () => {
    const user = await auth.protectPage({ roles: ["admin"] });

    if (!user) {
      return;
    }

    resetForm();
    await loadCustomers();
  });
})();
