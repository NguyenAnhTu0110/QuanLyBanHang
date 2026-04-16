(() => {
  const form = document.getElementById("loginForm");
  const submitButton = document.getElementById("loginSubmitButton");

  const bootstrapLogin = async () => {
    const session = await api.me();

    if (session.authenticated && session.data?.role) {
      auth.redirectByRole(session.data.role);
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.disabled = true;

    try {
      const response = await api.login({
        username: form.username.value.trim(),
        password: form.password.value,
      });

      app.showToast(response.message || "Đăng nhập thành công.");
      window.setTimeout(() => {
        window.location.href = response.redirectPath || "/";
      }, 350);
    } catch (error) {
      app.showToast(error.message, "error");
    } finally {
      submitButton.disabled = false;
    }
  });

  document.addEventListener("DOMContentLoaded", bootstrapLogin);
})();
