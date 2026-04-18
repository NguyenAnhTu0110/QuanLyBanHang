const crypto = require("crypto");

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

const hashPassword = (password) => {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [salt, originalHash] = storedHash.split(":");
  const passwordHash = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(originalHash, "hex"),
    Buffer.from(passwordHash, "hex")
  );
};

// Xác thực mật khẩu tuân thủ quy tắc chuẩn
const validatePasswordStrength = (password) => {
  const errors = [];

  // Kiểm tra độ dài
  if (!password || password.length < 8) {
    errors.push("Mật khẩu phải có ít nhất 8 ký tự.");
  }

  // Kiểm tra ký tự hoa
  if (!/[A-Z]/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất một ký tự hoa.");
  }

  // Kiểm tra ký tự thường
  if (!/[a-z]/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất một ký tự thường.");
  }

  // Kiểm tra chữ số
  if (!/[0-9]/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất một chữ số.");
  }

  // Kiểm tra ký tự đặc biệt
  if (!/[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&* v.v.).");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
};
