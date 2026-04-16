(() => {
  const resource = "products";
  const form = document.getElementById("productForm");
  const tableBody = document.getElementById("productTableBody");
  const formTitle = document.getElementById("productFormTitle");
  const submitButton = document.getElementById("productSubmitButton");
  const cancelButton = document.getElementById("productCancelButton");
  const categorySelect = document.getElementById("productCategory");
  let editingId = null;
  let categories = [];
  let products = [];

  const renderStatus = (status) =>
    status === "active"
      ? app.badge("Đang bán", "success")
      : app.badge("Tạm ngưng", "danger");

  const populateCategoryOptions = () => {
    app.populateSelect(categorySelect, categories, {
      labelKey: (item) => item.name,
      placeholder: categories.length ? "Chọn danh mục" : "Hãy tạo danh mục trước",
    });
  };

  const resetForm = () => {
    editingId = null;
    form.reset();
    form.status.value = "active";
    form.stock.value = "0";
    formTitle.textContent = "Thêm sản phẩm mới";
    submitButton.textContent = "Lưu sản phẩm";
    populateCategoryOptions();
  };

  const renderTable = () => {
    if (!products.length) {
      tableBody.innerHTML = app.renderEmptyRow(7, "Chưa có sản phẩm nào.");
      return;
    }

    tableBody.innerHTML = products
      .map(
        (product) => `
          <tr>
            <td>
              <strong>${app.escapeHtml(product.name)}</strong><br />
              <span class="muted">${app.escapeHtml(product.description || "Không có mô tả")}</span>
            </td>
            <td>${app.escapeHtml(product.sku)}</td>
            <td>${app.escapeHtml(product.category?.name || "--")}</td>
            <td>${app.formatCurrency(product.price)}</td>
            <td>${app.escapeHtml(product.stock)}</td>
            <td>${renderStatus(product.status)}</td>
            <td>
              <div class="actions">
                <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${product._id}">Sửa</button>
                <button class="btn btn-danger btn-sm" data-action="delete" data-id="${product._id}">Xóa</button>
              </div>
            </td>
          </tr>
        `
      )
      .join("");
  };

  const loadData = async () => {
    try {
      const [categoryResponse, productResponse] = await Promise.all([
        api.list("categories"),
        api.list(resource),
      ]);

      categories = categoryResponse.data || [];
      products = productResponse.data || [];
      populateCategoryOptions();
      renderTable();
    } catch (error) {
      app.showToast(error.message, "error");
      tableBody.innerHTML = app.renderEmptyRow(7, "Không tải được sản phẩm.");
    }
  };

  const fillForm = (product) => {
    editingId = product._id;
    form.name.value = product.name || "";
    form.sku.value = product.sku || "";
    form.category.value = product.category?._id || "";
    form.status.value = product.status || "active";
    form.price.value = product.price ?? "";
    form.stock.value = product.stock ?? 0;
    form.imageFile.value = ""; // Reset file input
    form.imageUrl.value = product.imageUrl || "";
    form.description.value = product.description || "";
    formTitle.textContent = `Cập nhật: ${product.name}`;
    submitButton.textContent = "Cập nhật sản phẩm";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!categories.length) {
      app.showToast("Hãy tạo danh mục trước khi thêm sản phẩm.", "error");
      return;
    }

    const imageFile = form.imageFile.files[0];
    let requestPromise;

    // Kiểm tra xem có file được chọn không
    if (imageFile) {
      // Sử dụng FormData để upload file
      const formData = new FormData();
      formData.append("name", form.name.value.trim());
      formData.append("sku", form.sku.value.trim());
      formData.append("category", form.category.value);
      formData.append("status", form.status.value);
      formData.append("price", Number(form.price.value));
      formData.append("stock", Number(form.stock.value));
      formData.append("image", imageFile);
      formData.append("imageUrl", form.imageUrl.value.trim());
      formData.append("description", form.description.value.trim());

      if (editingId) {
        requestPromise = api.updateWithFile(resource, editingId, formData);
      } else {
        requestPromise = api.createWithFile(resource, formData);
      }
    } else {
      // Sử dụng JSON API bình thường nếu không có file
      const payload = {
        name: form.name.value.trim(),
        sku: form.sku.value.trim(),
        category: form.category.value,
        status: form.status.value,
        price: Number(form.price.value),
        stock: Number(form.stock.value),
        imageUrl: form.imageUrl.value.trim(),
        description: form.description.value.trim(),
      };

      if (editingId) {
        requestPromise = api.update(resource, editingId, payload);
      } else {
        requestPromise = api.create(resource, payload);
      }
    }

    try {
      await requestPromise;
      app.showToast(
        editingId ? "Cập nhật sản phẩm thành công." : "Thêm sản phẩm thành công."
      );

      resetForm();
      await loadData();
    } catch (error) {
      app.showToast(error.message, "error");
    }
  });

  tableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
      return;
    }

    const product = products.find((item) => item._id === button.dataset.id);

    if (!product) {
      return;
    }

    if (button.dataset.action === "edit") {
      fillForm(product);
      return;
    }

    if (
      button.dataset.action === "delete" &&
      app.confirmDelete(`Xóa sản phẩm "${product.name}"?`)
    ) {
      try {
        await api.remove(resource, product._id);
        app.showToast("Đã xóa sản phẩm.");
        if (editingId === product._id) {
          resetForm();
        }
        await loadData();
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
    await loadData();
  });
})();
