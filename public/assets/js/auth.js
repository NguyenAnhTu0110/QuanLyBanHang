(() => {
  const roleLabelMap = {
    admin: "Quản trị viên",
    user: "Người dùng",
  };

  const redirectByRole = (role) => {
    window.location.replace(role === "admin" ? "/dashboard" : "/shop");
  };

  const fillUserInfo = (user) => {
    document.querySelectorAll("[data-auth-name]").forEach((element) => {
      element.textContent = user.fullName || user.username;
    });

    document.querySelectorAll("[data-auth-role]").forEach((element) => {
      element.textContent = roleLabelMap[user.role] || user.role;
    });
  };

  const bindLogout = () => {
    document.querySelectorAll("[data-logout-button]").forEach((button) => {
      if (button.dataset.logoutBound === "true") {
        return;
      }

      button.dataset.logoutBound = "true";
      button.addEventListener("click", async () => {
        try {
          await api.logout();
        } catch (error) {
          console.error(error);
        } finally {
          window.location.replace("/login");
        }
      });
    });
  };

  const protectPage = async ({ roles = [] } = {}) => {
    const response = await api.me();

    if (!response.authenticated || !response.data) {
      window.location.replace("/login");
      return null;
    }

    const user = response.data;

    if (roles.length && !roles.includes(user.role)) {
      redirectByRole(user.role);
      return null;
    }

    fillUserInfo(user);
    bindLogout();

    return user;
  };

  window.auth = {
    bindLogout,
    fillUserInfo,
    protectPage,
    redirectByRole,
  };
})();
