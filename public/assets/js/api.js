(() => {
  const API_ROOT = "/api";

  const request = async (path, options = {}) => {
    const config = {
      method: options.method || "GET",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        ...(options.headers || {}),
      },
    };

    if (options.body !== undefined) {
      // Nếu body là FormData, không set Content-Type (browser sẽ tự set)
      if (!(options.body instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(options.body);
      } else {
        config.body = options.body;
      }
    }

    const response = await fetch(`${API_ROOT}${path}`, config);
    const isJson = (response.headers.get("content-type") || "").includes(
      "application/json"
    );
    const payload = isJson ? await response.json() : {};

    if (!response.ok) {
      if (
        response.status === 401 &&
        !options.skipAuthRedirect &&
        !path.startsWith("/auth/") &&
        window.location.pathname !== "/login"
      ) {
        window.location.replace("/login");
      }

      const error = new Error(payload.message || "Không thể xử lý yêu cầu.");
      if (payload && typeof payload === "object") {
        error.payload = payload;
        if (Array.isArray(payload.errors)) {
          error.errors = payload.errors;
        }
      }
      throw error;
    }

    return payload;
  };

  window.api = {
    request,
    login: (body) =>
      request("/auth/login", {
        method: "POST",
        body,
      }),
    register: (body) =>
      request("/auth/register", {
        method: "POST",
        body,
      }),
    logout: () =>
      request("/auth/logout", {
        method: "POST",
      }),
    me: () =>
      request("/auth/me", {
        skipAuthRedirect: true,
      }),
    dashboardStats: () => request("/dashboard/stats"),
    storeProducts: () => request("/store/products"),
    list: (resource) => request(`/${resource}`),
    get: (resource, id) => request(`/${resource}/${id}`),
    create: (resource, body) =>
      request(`/${resource}`, {
        method: "POST",
        body,
      }),
    createWithFile: (resource, body) =>
      request(`/${resource}`, {
        method: "POST",
        body,
      }),
    update: (resource, id, body) =>
      request(`/${resource}/${id}`, {
        method: "PUT",
        body,
      }),
    updateWithFile: (resource, id, body) =>
      request(`/${resource}/${id}`, {
        method: "PUT",
        body,
      }),
    remove: (resource, id) =>
      request(`/${resource}/${id}`, {
        method: "DELETE",
      }),
    // Store/Customer endpoints
    getCustomer: () => request("/store/customer"),
    updateCustomer: (body) =>
      request("/store/customer", {
        method: "PUT",
        body,
      }),
    getProvinces: () => request("/store/addresses/provinces"),
    getDistricts: (provinceId) =>
      request(`/store/addresses/districts/${provinceId}`),
    getWards: (districtId) =>
      request(`/store/addresses/wards/${districtId}`),
    createOrder: (body) =>
      request("/store/orders", {
        method: "POST",
        body,
      }),
    updateOrderPaymentStatus: (orderId, paymentStatus) =>
      request(`/orders/${orderId}/payment-status`, {
        method: "PATCH",
        body: { paymentStatus },
      }),
    updateOrderDeliveryStatus: (orderId, status) =>
      request(`/orders/${orderId}/delivery-status`, {
        method: "PATCH",
        body: { status },
      }),
  };
})();
