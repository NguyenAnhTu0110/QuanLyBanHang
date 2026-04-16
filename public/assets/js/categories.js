(() => {
  const resource = "categories";
  const form = document.getElementById("categoryForm");
  const tableBody = document.getElementById("categoryTableBody");
  const formTitle = document.getElementById("categoryFormTitle");
  const submitButton = document.getElementById("categorySubmitButton");
  const cancelButton = document.getElementById("categoryCancelButton");
  let editingId = null;
  let categories = [];

  const renderStatus = (isActive) =>
    isActive
      ? app.badge("Đang hoạt động", "success")
      : app.badge("Tạm khóa", "danger");

  const resetForm = () => {
    editingId = null;
    form.reset();
    document.getElementById("categoryStatus").value = "true";
    formTitle.textContent = "Thêm danh mục mới";
    submitButton.textContent = "Lưu danh mục";
  };

  const renderTable = () => {
    if (!categories.length) {
      tableBody.innerHTML = app.renderEmptyRow(5, "Chưa có danh mục nào.");
      return;
    }

    tableBody.innerHTML = categories
      .map(
        (category) => `
          <tr>
            <td><strong>${app.escapeHtml(category.name)}</strong></td>
            <td>${app.escapeHtml(category.description || "--")}</td>
            <td>${renderStatus(category.isActive)}</td>
            <td>${app.formatDate(category.createdAt)}</td>
            <td>
              <div class="actions">
                <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${category._id}">Sửa</button>
                <button class="btn btn-danger btn-sm" data-action="delete" data-id="${category._id}">Xóa</button>
              </div>
            </td>
          </tr>
        `
      )
      .join("");
  };

  const loadCategories = async () => {
    try {
      const response = await api.list(resource);
      categories = response.data || [];
      renderTable();
    } catch (error) {
      app.showToast(error.message, "error");
      tableBody.innerHTML = app.renderEmptyRow(5, "Không tải được danh mục.");
    }
  };

  const fillForm = (category) => {
    editingId = category._id;
    form.name.value = category.name || "";
    form.description.value = category.description || "";
    form.isActive.value = String(category.isActive);
    formTitle.textContent = `Cập nhật: ${category.name}`;
    submitButton.textContent = "Cập nhật danh mục";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.value.trim(),
      description: form.description.value.trim(),
      isActive: form.isActive.value === "true",
    };

    try {
      if (editingId) {
        await api.update(resource, editingId, payload);
        app.showToast("Cập nhật danh mục thành công.");
      } else {
        await api.create(resource, payload);
        app.showToast("Thêm danh mục thành công.");
      }

      resetForm();
      await loadCategories();
    } catch (error) {
      app.showToast(error.message, "error");
    }
  });

  tableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
      return;
    }

    const category = categories.find((item) => item._id === button.dataset.id);

    if (!category) {
      return;
    }

    if (button.dataset.action === "edit") {
      fillForm(category);
      return;
    }

    if (
      button.dataset.action === "delete" &&
      app.confirmDelete(`Xóa danh mục "${category.name}"?`)
    ) {
      try {
        await api.remove(resource, category._id);
        app.showToast("Đã xóa danh mục.");
        if (editingId === category._id) {
          resetForm();
        }
        await loadCategories();
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
    await loadCategories();
  });
})();
