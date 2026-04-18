(() => {
  const form = document.getElementById("registerForm");
  const submitButton = document.getElementById("registerSubmitButton");
  const passwordInput = document.getElementById("registerPassword");
  const passwordConfirmInput = document.getElementById("registerPasswordConfirm");
  const passwordStrengthSpan = document.getElementById("passwordStrength");
  const errorsDiv = document.getElementById("registerErrors");

  // Quy tắc xác thực mật khẩu
  const passwordRules = [
    {
      regex: /.{8,}/,
      text: "Tối thiểu 8 ký tự",
    },
    {
      regex: /[A-Z]/,
      text: "Chứa ít nhất một chữ hoa (A-Z)",
    },
    {
      regex: /[a-z]/,
      text: "Chứa ít nhất một chữ thường (a-z)",
    },
    {
      regex: /[0-9]/,
      text: "Chứa ít nhất một chữ số (0-9)",
    },
    {
      regex: /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/,
      text: "Chứa ít nhất một ký tự đặc biệt (!@#$%^&*)",
    },
  ];

  // Kiểm tra độ mạnh mật khẩu
  const checkPasswordStrength = (password) => {
    const results = passwordRules.map((rule) => ({
      ...rule,
      passed: rule.regex.test(password),
    }));

    return results;
  };

  // Hiển thị thông tin mật khẩu
  const displayPasswordStrength = (password) => {
    if (!password) {
      passwordStrengthSpan.textContent = "";
      return;
    }

    const results = checkPasswordStrength(password);
    const passedCount = results.filter((r) => r.passed).length;
    const totalRules = results.length;

    const statusMap = {
      0: { text: "Rất yếu", color: "#d32f2f", width: "20%" },
      1: { text: "Yếu", color: "#f57c00", width: "40%" },
      2: { text: "Trung bình", color: "#fbc02d", width: "60%" },
      3: { text: "Tốt", color: "#7cb342", width: "80%" },
      4: { text: "Rất tốt", color: "#388e3c", width: "100%" },
      5: { text: "Xuất sắc", color: "#1976d2", width: "100%" },
    };

    const status = statusMap[passedCount];

    let html = `
      <div style="margin-bottom: 8px;">
        <div style="font-size: 0.85em; margin-bottom: 4px;">
          Độ mạnh: <span style="color: ${status.color}; font-weight: bold;">${status.text}</span>
        </div>
        <div style="height: 4px; background: #e0e0e0; border-radius: 2px; overflow: hidden;">
          <div style="height: 100%; width: ${status.width}; background: ${status.color}; transition: all 0.3s;"></div>
        </div>
      </div>
      <ul style="margin: 8px 0; padding: 0 0 0 20px; font-size: 0.85em;">
    `;

    results.forEach((result) => {
      const icon = result.passed ? "✓" : "○";
      const style = result.passed ? "color: #4caf50;" : "color: #999;";
      html += `<li style="${style}">${icon} ${result.text}</li>`;
    });

    html += "</ul>";
    passwordStrengthSpan.innerHTML = html;
  };

  // Hiển thị lỗi
  const showErrors = (errors) => {
    if (!Array.isArray(errors) || errors.length === 0) {
      errorsDiv.style.display = "none";
      return;
    }

    let html = "<strong>Lỗi đăng ký:</strong><ul>";
    errors.forEach((error) => {
      html += `<li>${error}</li>`;
    });
    html += "</ul>";

    errorsDiv.innerHTML = html;
    errorsDiv.style.display = "block";
  };

  // Kiểm tra mật khẩu trùng
  const checkPasswordMatch = () => {
    if (passwordInput.value && passwordConfirmInput.value) {
      if (passwordInput.value !== passwordConfirmInput.value) {
        return false;
      }
    }
    return true;
  };

  // Event listeners
  passwordInput.addEventListener("input", () => {
    displayPasswordStrength(passwordInput.value);
  });

  passwordConfirmInput.addEventListener("input", () => {
    if (passwordConfirmInput.value) {
      if (checkPasswordMatch()) {
        passwordConfirmInput.style.borderColor = "";
      } else {
        passwordConfirmInput.style.borderColor = "#d32f2f";
      }
    } else {
      passwordConfirmInput.style.borderColor = "";
    }
  });

  // Bootstrap login
  const bootstrapRegister = async () => {
    const session = await api.me();

    if (session.authenticated && session.data?.role) {
      auth.redirectByRole(session.data.role);
    }
  };

  // Form submit
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Validate password match
    if (!checkPasswordMatch()) {
      showErrors(["Mật khẩu không khớp."]);
      passwordConfirmInput.focus();
      return;
    }

    submitButton.disabled = true;

    try {
      const response = await api.register({
        username: form.username.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        password: form.password.value,
        passwordConfirm: form.passwordConfirm.value,
      });

      app.showToast(response.message || "Đăng ký thành công.");
      showErrors([]); // Clear errors

      window.setTimeout(() => {
        window.location.href = response.redirectPath || "/";
      }, 350);
    } catch (error) {
      app.showToast(error.message, "error");
      showErrors(Array.isArray(error?.errors) ? error.errors : [error.message]);
    } finally {
      submitButton.disabled = false;
    }
  });

  document.addEventListener("DOMContentLoaded", bootstrapRegister);
})();
