(() => {
  // Ưu tiên lấy từ config của Window (nếu có inject từ server) hoặc fallback về mặc định
  const API_ROOT = window.ENV?.API_URL || "/api";
  const DEFAULT_TIMEOUT = 15000; // 15 giây

  /**
   * Helper function build Query String từ Object
   * Vd: { page: 1, limit: 10 } => "?page=1&limit=10"
   */
  const buildQueryString = (params) => {
    if (!params || Object.keys(params).length === 0) return "";
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value);
      }
    });
    return `?${searchParams.toString()}`;
  };

  const request = async (path, options = {}) => {
    // 1. Setup Timeout với AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);

    const config = {
      method: options.method || "GET",
      credentials: "same-origin",
      signal: controller.signal, // Gắn signal để có thể hủy request
      headers: {
        Accept: "application/json",
        ...(options.headers || {}),
      },
    };

    // 2. Xử lý Body & Content-Type thông minh
    if (options.body !== undefined) {
      if (options.body instanceof FormData) {
        // Trình duyệt tự set Content-Type là multipart/form-data kèm boundary
        config.body = options.body;
      } else {
        config.headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(options.body);
      }
    }

    // 3. Xử lý Query Params
    const queryString = buildQueryString(options.params);
    const fullUrl = `${API_ROOT}${path}${queryString}`;

    try {
      const response = await fetch(fullUrl, config);
      clearTimeout(timeoutId); // Request thành công thì clear timeout

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const payload = isJson ? await response.json() : {};

      if (!response.ok) {
        // Xử lý Global 401 Unauthorized
        if (
          response.status === 401 &&
          !options.skipAuthRedirect &&
          !path.startsWith("/auth/") &&
          window.location.pathname !== "/login"
        ) {
          // Lưu lại đường dẫn cũ để đăng nhập xong quay lại
          const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.replace(`/login?redirect=${currentPath}`);
          return; // Dừng thực thi
        }

        const error = new Error(payload.message || "Không thể xử lý yêu cầu.");
        error.status = response.status;
        error.payload = payload;
        error.errors = payload.errors || [];
        throw error;
      }

      return payload;

    } catch (error) {
      clearTimeout(timeoutId);
      // Bắt lỗi Timeout hoặc Mất mạng
      if (error.name === "AbortError") {
        throw new Error("Yêu cầu bị quá thời gian. Vui lòng kiểm tra lại mạng.");
      }
      if (error.message === "Failed to fetch") {
        throw new Error("Mất kết nối đến máy chủ.");
      }
      throw error;
    }
  };

  window.api = {
    request,
    
    // -- Auth --
    login: (body) => request("/auth/login", { method: "POST", body }),
    register: (body) => request("/auth/register", { method: "POST", body }),
    logout: () => request("/auth/logout", { method: "POST" }),
    me: () => request("/auth/me", { skipAuthRedirect: true }),
    
    // -- Dashboards --
    dashboardStats: () => request("/dashboard/stats"),
    
    // -- Generic CRUD --
    // Đã thêm hỗ trợ params để có thể gọi: api.list('customers', { page: 1, limit: 10 })
    list: (resource, params) => request(`/${resource}`, { params }),
    get: (resource, id) => request(`/${resource}/${id}`),
    
    // Gộp chung create và createWithFile vì request xử lý FormData tự động rồi
    create: (resource, body) => request(`/${resource}`, { method: "POST", body }),
    update: (resource, id, body) => request(`/${resource}/${id}`, { method: "PUT", body }),
    remove: (resource, id) => request(`/${resource}/${id}`, { method: "DELETE" }),
    
    // -- Store/Customer endpoints --
    storeProducts: (params) => request("/store/products", { params }),
    getCustomer: () => request("/store/customer"),
    updateCustomer: (body) => request("/store/customer", { method: "PUT", body }),
    
    // -- Địa chỉ --
    getProvinces: () => request("/store/addresses/provinces"),
    getDistricts: (provinceId) => request(`/store/addresses/districts/${provinceId}`),
    getWards: (districtId) => request(`/store/addresses/wards/${districtId}`),
    
    // -- Đơn hàng --
    createOrder: (body) => request("/store/orders", { method: "POST", body }),
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