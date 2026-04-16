(() => {
  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const formatDate = (value) => {
    if (!value) {
      return "--";
    }

    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
    }).format(new Date(value));
  };

  const toInputDate = (value) => {
    if (!value) {
      return "";
    }

    return new Date(value).toISOString().slice(0, 10);
  };

  const badge = (label, variant = "neutral") =>
    `<span class="badge badge-${variant}">${escapeHtml(label)}</span>`;

  const renderEmptyRow = (colspan, message) =>
    `<tr><td colspan="${colspan}" class="empty-cell">${escapeHtml(
      message
    )}</td></tr>`;

  const getToastStack = () => {
    let stack = document.querySelector(".toast-stack");

    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }

    return stack;
  };

  const showToast = (message, type = "success") => {
    const stack = getToastStack();
    const toast = document.createElement("div");
    const title = type === "success" ? "Thành công" : "Có lỗi";

    toast.className = `toast ${type}`;
    toast.innerHTML = `<strong>${title}</strong><span>${escapeHtml(
      message
    )}</span>`;

    stack.appendChild(toast);

    window.setTimeout(() => {
      toast.remove();
    }, 3200);
  };

  const populateSelect = (select, items, config = {}) => {
    const {
      valueKey = "_id",
      labelKey = "name",
      placeholder = "Chọn dữ liệu",
    } = config;

    const options = items.map((item) => {
      const value = typeof valueKey === "function" ? valueKey(item) : item[valueKey];
      const label =
        typeof labelKey === "function" ? labelKey(item) : item[labelKey];

      return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
    });

    select.innerHTML = [`<option value="">${escapeHtml(placeholder)}</option>`, ...options].join(
      ""
    );
  };

  const setActiveNav = () => {
    const currentPage = document.body.dataset.page;

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.toggle("active", link.dataset.page === currentPage);
    });
  };

  document.addEventListener("DOMContentLoaded", setActiveNav);

  window.app = {
    escapeHtml,
    formatCurrency,
    formatDate,
    toInputDate,
    badge,
    renderEmptyRow,
    showToast,
    confirmDelete: (message) => window.confirm(message),
    populateSelect,
  };
})();
