(() => {
  const resource = "products";
  const form = document.getElementById("productForm");
  const tableBody = document.getElementById("productTableBody");
  const formTitle = document.getElementById("productFormTitle");
  const submitButton = document.getElementById("productSubmitButton");
  const cancelButton = document.getElementById("productCancelButton");
  const categorySelect = document.getElementById("productCategory");
  const filterCategorySelect = document.getElementById("filterCategory");
  const imageFileInput = document.getElementById("productImageFile");
  const skuInput = document.getElementById("productSku");
  const skuHint = document.getElementById("skuHint");
  const filterResultInfo = document.getElementById("filterResultInfo");
  const filterResultText = document.getElementById("filterResultText");

  let editingId = null;
  let categories = [];
  let products = [];
  let previewUrl = "";

  // ──────────────────────────────────────────────
  // SKU prefix map: tên danh mục → chữ cái đầu SKU
  // ──────────────────────────────────────────────
  const SKU_PREFIX_MAP = {
    apple: "A",
    oppo: "O",
    realme: "R",
    samsung: "S",
    vivo: "V",
    xiaomi: "X",
  };

  /**
   * Lấy prefix SKU dựa trên tên danh mục.
   * Nếu không khớp → dùng chữ cái đầu tiên của tên (in hoa).
   */
  const getSkuPrefix = (categoryName) => {
    if (!categoryName) return null;
    const key = categoryName.trim().toLowerCase();
    return SKU_PREFIX_MAP[key] || categoryName.trim()[0].toUpperCase();
  };

  /**
   * Tính số thứ tự tiếp theo cho một prefix SKU.
   * Ví dụ: các SKU A-01, A-03 đã có → trả về A-04.
   */
  const getNextSkuNumber = (prefix) => {
    const regex = new RegExp(`^${prefix}-(\\d+)$`, "i");
    let maxNum = 0;
    products.forEach((p) => {
      if (editingId && p._id === editingId) return; // bỏ qua sản phẩm đang sửa
      const match = p.sku?.match(regex);
      if (match) {
        maxNum = Math.max(maxNum, parseInt(match[1], 10));
      }
    });
    const next = maxNum + 1;
    return `${prefix}-${String(next).padStart(2, "0")}`;
  };

  /**
   * Tự động điền SKU khi người dùng chọn danh mục.
   * Nếu đang chỉnh sửa → chỉ gợi ý, không ghi đè SKU gốc.
   */
  const handleCategoryChange = () => {
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    const categoryName = selectedOption?.text || "";
    const prefix = getSkuPrefix(categoryName);

    if (!prefix || !categorySelect.value) {
      skuHint.textContent = "";
      return;
    }

    const suggestedSku = getNextSkuNumber(prefix);

    if (!editingId) {
      // Chế độ thêm mới: tự điền SKU
      skuInput.value = suggestedSku;
      skuHint.textContent = `Gợi ý: ${suggestedSku} (có thể thay đổi)`;
    } else {
      // Chế độ chỉnh sửa: chỉ hiển thị gợi ý, không ghi đè
      skuHint.textContent = `Mã sản phẩm gợi ý cho danh mục này: ${suggestedSku}`;
    }
  };

  // ──────────────────────────────────────────────
  // Render helpers
  // ──────────────────────────────────────────────
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

  /**
   * Cập nhật dropdown lọc danh mục ở bảng sản phẩm.
   * Giữ nguyên lựa chọn hiện tại nếu vẫn còn tồn tại.
   */
  const populateFilterOptions = () => {
    const currentValue = filterCategorySelect.value;
    filterCategorySelect.innerHTML = '<option value="">Tất cả danh mục</option>';
    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat._id;
      opt.textContent = cat.name;
      filterCategorySelect.appendChild(opt);
    });
    // Khôi phục lựa chọn trước đó nếu còn hợp lệ
    if (currentValue && categories.some((c) => c._id === currentValue)) {
      filterCategorySelect.value = currentValue;
    }
  };

  const resetForm = () => {
    editingId = null;
    form.reset();
    form.status.value = "active";
    form.stock.value = "0";
    formTitle.textContent = "Thêm sản phẩm mới";
    submitButton.textContent = "Lưu sản phẩm";
    skuHint.textContent = "";
    populateCategoryOptions();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = "";
    }
  };

  /**
   * Render bảng sản phẩm, có áp dụng filter danh mục.
   */
  const renderTable = () => {
    const filterValue = filterCategorySelect.value;

    const filtered = filterValue
      ? products.filter((p) => {
          const catId = p.category?._id || p.category;
          return catId === filterValue;
        })
      : products;

    // Hiển thị thông tin kết quả lọc
    if (filterValue) {
      const catName = categories.find((c) => c._id === filterValue)?.name || "";
      filterResultInfo.style.display = "block";
      filterResultText.textContent = `Hiển thị ${filtered.length} sản phẩm trong danh mục "${catName}"`;
    } else {
      filterResultInfo.style.display = "none";
    }

    if (!filtered.length) {
      tableBody.innerHTML = app.renderEmptyRow(
        7,
        filterValue ? "Không có sản phẩm nào trong danh mục này." : "Chưa có sản phẩm nào."
      );
      return;
    }

    tableBody.innerHTML = filtered
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

  // ──────────────────────────────────────────────
  // Data loading
  // ──────────────────────────────────────────────
  const loadData = async () => {
    try {
      const [categoryResponse, productResponse] = await Promise.all([
        api.list("categories"),
        api.list(resource),
      ]);

      categories = categoryResponse.data || [];
      products = productResponse.data || [];
      populateCategoryOptions();
      populateFilterOptions();
      renderTable();
    } catch (error) {
      app.showToast(error.message, "error");
      tableBody.innerHTML = app.renderEmptyRow(7, "Không tải được sản phẩm.");
    }
  };

  // ──────────────────────────────────────────────
  // Fill form khi chỉnh sửa
  // ──────────────────────────────────────────────
  const fillForm = (product) => {
    editingId = product._id;
    form.name.value = product.name || "";
    form.sku.value = product.sku || "";
    form.category.value = product.category?._id || "";
    form.status.value = product.status || "active";
    form.price.value = product.price ?? "";
    form.stock.value = product.stock ?? 0;
    form.image.value = "";
    form.imageUrl.value = product.imageUrl || product.image || "";
    form.description.value = product.description || "";
    formTitle.textContent = `Cập nhật: ${product.name}`;
    submitButton.textContent = "Cập nhật sản phẩm";

    // Hiển thị gợi ý SKU cho danh mục đang chọn
    handleCategoryChange();

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ──────────────────────────────────────────────
  // Event: Submit form
  // ──────────────────────────────────────────────
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!categories.length) {
      app.showToast("Hãy tạo danh mục trước khi thêm sản phẩm.", "error");
      return;
    }

    if (!form.name.value.trim()) {
      app.showToast("Vui lòng nhập tên sản phẩm.", "error");
      form.name.focus();
      return;
    }

    if (!form.sku.value.trim()) {
      app.showToast("Vui lòng nhập SKU.", "error");
      form.sku.focus();
      return;
    }

    if (!form.category.value) {
      app.showToast("Vui lòng chọn danh mục.", "error");
      form.category.focus();
      return;
    }

    if (!form.price.value || Number(form.price.value) <= 0) {
      app.showToast("Giá bán phải lớn hơn 0.", "error");
      form.price.focus();
      return;
    }

    if (!form.stock.value && form.stock.value !== "0") {
      app.showToast("Vui lòng nhập số lượng tồn kho.", "error");
      form.stock.focus();
      return;
    }

    submitButton.disabled = true;

    const imageFile = form.image.files[0];
    let requestPromise;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("name", form.name.value.trim());
        formData.append("sku", form.sku.value.trim());
        formData.append("category", form.category.value);
        formData.append("status", form.status.value);
        formData.append("price", form.price.value);
        formData.append("stock", form.stock.value);
        formData.append("image", imageFile);
        formData.append("imageUrl", form.imageUrl.value.trim());
        formData.append("description", form.description.value.trim());

        requestPromise = editingId
          ? api.updateWithFile(resource, editingId, formData)
          : api.createWithFile(resource, formData);
      } else {
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
          delete payload.id;
          requestPromise = api.create(resource, payload);
        }
      }

      await requestPromise;
      app.showToast(
        editingId ? "Cập nhật sản phẩm thành công." : "Thêm sản phẩm thành công."
      );

      resetForm();
      await loadData();
    } catch (error) {
      app.showToast(error.message, "error");
    } finally {
      submitButton.disabled = false;
    }
  });

  // ──────────────────────────────────────────────
  // Event: Click nút trong bảng (Sửa / Xóa)
  // ──────────────────────────────────────────────
  tableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const product = products.find((item) => item._id === button.dataset.id);
    if (!product) return;

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
        if (editingId === product._id) resetForm();
        await loadData();
      } catch (error) {
        app.showToast(error.message, "error");
      }
    }
  });

  // ──────────────────────────────────────────────
  // Event: Chọn danh mục trong form → auto SKU
  // ──────────────────────────────────────────────
  categorySelect.addEventListener("change", handleCategoryChange);

  // ──────────────────────────────────────────────
  // Event: Filter danh mục ở bảng sản phẩm
  // ──────────────────────────────────────────────
  filterCategorySelect.addEventListener("change", renderTable);

  // ──────────────────────────────────────────────
  // Event: Chọn file ảnh
  // ──────────────────────────────────────────────
  cancelButton.addEventListener("click", resetForm);

  imageFileInput.addEventListener("change", () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = "";
    }
    const selected = imageFileInput.files?.[0];
    if (!selected) return;
    previewUrl = URL.createObjectURL(selected);
    app.showToast(`Đã chọn ảnh: ${selected.name}`);
  });

  // ──────────────────────────────────────────────
  // Init
  // ──────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", async () => {
    const user = await auth.protectPage({ roles: ["admin"] });
    if (!user) return;

    resetForm();
    await loadData();
  });
})();