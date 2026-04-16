(() => {
  const resource = "orders";
  const form = document.getElementById("orderForm");
  const tableBody = document.getElementById("orderTableBody");
  const formTitle = document.getElementById("orderFormTitle");
  const submitButton = document.getElementById("orderSubmitButton");
  const cancelButton = document.getElementById("orderCancelButton");
  const addItemButton = document.getElementById("addOrderItemButton");
  const itemsBuilder = document.getElementById("orderItemsBuilder");
  const customerSelect = document.getElementById("orderCustomer");
  const shippingAddressInput = document.getElementById("orderShippingAddress");
  const orderDateInput = document.getElementById("orderDate");
  const itemsCountElement = document.getElementById("orderItemsCount");
  const previewTotalElement = document.getElementById("orderPreviewTotal");
  const previewCustomerElement = document.getElementById("orderPreviewCustomer");

  let editingId = null;
  let products = [];
  let customers = [];
  let orders = [];

  const paymentLabels = {
    cod: "COD",
    bank_transfer: "Chuyển khoản",
    momo: "MoMo",
    card: "Thẻ ngân hàng",
  };

  const statusConfig = {
    pending: ["Chờ xử lý", "warning"],
    confirmed: ["Đã xác nhận", "neutral"],
    shipping: ["Đang giao", "warning"],
    completed: ["Hoàn thành", "success"],
    cancelled: ["Đã hủy", "danger"],
  };

  const getProductById = (id) => products.find((item) => item._id === id);
  const getCustomerById = (id) => customers.find((item) => item._id === id);

  const renderStatus = (status) => {
    const [label, variant] = statusConfig[status] || [status || "Khác", "neutral"];
    return app.badge(label, variant);
  };

  const buildProductOptions = (selectedId = "") =>
    [
      '<option value="">Chọn sản phẩm</option>',
      ...products.map(
        (product) => `
          <option value="${app.escapeHtml(product._id)}" ${
            selectedId === product._id ? "selected" : ""
          }>
            ${app.escapeHtml(product.name)} - ${app.formatCurrency(product.price)}
          </option>
        `
      ),
    ].join("");

  const populateCustomerOptions = () => {
    app.populateSelect(customerSelect, customers, {
      labelKey: (customer) => `${customer.fullName} - ${customer.phone}`,
      placeholder: customers.length ? "Chọn khách hàng" : "Hãy tạo khách hàng trước",
    });
  };

  const setDefaultDate = () => {
    orderDateInput.value = app.toInputDate(new Date());
  };

  const addItemRow = (item = {}) => {
    const row = document.createElement("div");
    row.className = "builder-row";
    row.innerHTML = `
      <div class="field">
        <label>Sản phẩm</label>
        <select data-field="product">
          ${buildProductOptions(item.product || "")}
        </select>
      </div>
      <div class="field">
        <label>Số lượng</label>
        <input data-field="quantity" type="number" min="1" value="${app.escapeHtml(
          item.quantity || 1
        )}" />
      </div>
      <button class="btn btn-danger btn-sm" type="button" data-action="remove-item">
        Xóa dòng
      </button>
    `;

    itemsBuilder.appendChild(row);
  };

  const ensureItemRows = () => {
    if (!itemsBuilder.children.length) {
      addItemRow();
    }
  };

  const updatePreview = () => {
    const rows = [...itemsBuilder.querySelectorAll(".builder-row")];
    let lineCount = 0;
    let total = 0;

    rows.forEach((row) => {
      const productId = row.querySelector('[data-field="product"]').value;
      const quantity = Number(row.querySelector('[data-field="quantity"]').value) || 0;

      if (!productId) {
        return;
      }

      const product = getProductById(productId);
      lineCount += 1;
      total += (Number(product?.price) || 0) * quantity;
    });

    itemsCountElement.textContent = String(lineCount);
    previewTotalElement.textContent = app.formatCurrency(total);
    previewCustomerElement.textContent =
      getCustomerById(customerSelect.value)?.fullName || "Chưa chọn";
  };

  const resetForm = () => {
    editingId = null;
    form.reset();
    formTitle.textContent = "Tạo đơn hàng mới";
    submitButton.textContent = "Lưu đơn hàng";
    itemsBuilder.innerHTML = "";
    populateCustomerOptions();
    setDefaultDate();
    addItemRow();
    updatePreview();
  };

  const collectItems = () => {
    const rows = [...itemsBuilder.querySelectorAll(".builder-row")];
    const items = rows
      .map((row) => ({
        product: row.querySelector('[data-field="product"]').value,
        quantity: Number(row.querySelector('[data-field="quantity"]').value),
      }))
      .filter((item) => item.product);

    if (!items.length) {
      throw new Error("Hãy chọn ít nhất 1 sản phẩm cho đơn hàng.");
    }

    if (items.some((item) => !Number.isFinite(item.quantity) || item.quantity <= 0)) {
      throw new Error("Số lượng của mỗi sản phẩm phải lớn hơn 0.");
    }

    return items;
  };

  const renderTable = () => {
    if (!orders.length) {
      tableBody.innerHTML = app.renderEmptyRow(7, "Chưa có đơn hàng nào.");
      return;
    }

    tableBody.innerHTML = orders
      .map((order) => {
        const itemsSummary = order.items
          .map(
            (item) =>
              `${app.escapeHtml(item.productName || item.product?.name || "Sản phẩm")} x${app.escapeHtml(
                item.quantity
              )}`
          )
          .join("<br />");

        return `
          <tr>
            <td><strong>${app.escapeHtml(order.orderCode)}</strong><br /><span class="muted">${app.formatDate(
              order.orderDate
            )}</span></td>
            <td>${app.escapeHtml(order.customer?.fullName || "Khách lẻ")}</td>
            <td>${itemsSummary}</td>
            <td>${app.formatCurrency(order.totalAmount)}</td>
            <td>${renderStatus(order.status)}</td>
            <td>${app.escapeHtml(paymentLabels[order.paymentMethod] || order.paymentMethod || "--")}</td>
            <td>
              <div class="actions">
                <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${order._id}">Sửa</button>
                <button class="btn btn-danger btn-sm" data-action="delete" data-id="${order._id}">Xóa</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  };

  const loadData = async () => {
    try {
      const [customerResponse, productResponse, orderResponse] = await Promise.all([
        api.list("customers"),
        api.list("products"),
        api.list(resource),
      ]);

      customers = customerResponse.data || [];
      products = productResponse.data || [];
      orders = orderResponse.data || [];

      populateCustomerOptions();
      renderTable();
      updatePreview();
    } catch (error) {
      app.showToast(error.message, "error");
      tableBody.innerHTML = app.renderEmptyRow(7, "Không tải được đơn hàng.");
    }
  };

  const fillForm = (order) => {
    editingId = order._id;
    formTitle.textContent = `Cập nhật đơn ${order.orderCode}`;
    submitButton.textContent = "Cập nhật đơn hàng";

    populateCustomerOptions();
    customerSelect.value = order.customer?._id || "";
    form.status.value = order.status || "pending";
    form.paymentMethod.value = order.paymentMethod || "cod";
    orderDateInput.value = app.toInputDate(order.orderDate || order.createdAt);
    shippingAddressInput.value = order.shippingAddress || "";
    form.note.value = order.note || "";

    itemsBuilder.innerHTML = "";
    order.items.forEach((item) => {
      addItemRow({
        product: item.product?._id || item.product || "",
        quantity: item.quantity || 1,
      });
    });

    ensureItemRows();
    updatePreview();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!customers.length) {
      app.showToast("Hãy tạo khách hàng trước khi lập đơn.", "error");
      return;
    }

    if (!products.length) {
      app.showToast("Hãy tạo sản phẩm trước khi lập đơn.", "error");
      return;
    }

    try {
      const payload = {
        customer: customerSelect.value,
        status: form.status.value,
        paymentMethod: form.paymentMethod.value,
        shippingAddress: shippingAddressInput.value.trim(),
        note: form.note.value.trim(),
        orderDate: orderDateInput.value,
        items: collectItems(),
      };

      if (!payload.customer) {
        throw new Error("Hãy chọn khách hàng.");
      }

      if (editingId) {
        await api.update(resource, editingId, payload);
        app.showToast("Cập nhật đơn hàng thành công.");
      } else {
        await api.create(resource, payload);
        app.showToast("Tạo đơn hàng thành công.");
      }

      await loadData();
      resetForm();
    } catch (error) {
      app.showToast(error.message, "error");
    }
  });

  tableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
      return;
    }

    const order = orders.find((item) => item._id === button.dataset.id);

    if (!order) {
      return;
    }

    if (button.dataset.action === "edit") {
      fillForm(order);
      return;
    }

    if (
      button.dataset.action === "delete" &&
      app.confirmDelete(`Xóa đơn hàng "${order.orderCode}"?`)
    ) {
      try {
        await api.remove(resource, order._id);
        app.showToast("Đã xóa đơn hàng.");
        if (editingId === order._id) {
          resetForm();
        }
        await loadData();
      } catch (error) {
        app.showToast(error.message, "error");
      }
    }
  });

  addItemButton.addEventListener("click", () => {
    if (!products.length) {
      app.showToast("Hãy tạo sản phẩm trước khi thêm dòng đơn hàng.", "error");
      return;
    }

    addItemRow();
    updatePreview();
  });

  itemsBuilder.addEventListener("click", (event) => {
    const button = event.target.closest('button[data-action="remove-item"]');

    if (!button) {
      return;
    }

    button.closest(".builder-row").remove();
    ensureItemRows();
    updatePreview();
  });

  itemsBuilder.addEventListener("change", updatePreview);
  itemsBuilder.addEventListener("input", updatePreview);

  customerSelect.addEventListener("change", () => {
    const selectedCustomer = getCustomerById(customerSelect.value);

    if (selectedCustomer && !editingId && !shippingAddressInput.value.trim()) {
      shippingAddressInput.value = selectedCustomer.address || "";
    }

    updatePreview();
  });

  cancelButton.addEventListener("click", resetForm);

  document.addEventListener("DOMContentLoaded", async () => {
    const user = await auth.protectPage({ roles: ["admin"] });

    if (!user) {
      return;
    }

    await loadData();
    resetForm();
  });
})();
