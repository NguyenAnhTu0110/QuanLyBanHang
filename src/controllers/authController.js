const User = require("../models/User");
const Customer = require("../models/Customer");
const asyncHandler = require("../utils/asyncHandler");
const { verifyPassword, hashPassword, validatePasswordStrength } = require("../utils/password");

const buildSessionUser = (user) => ({
  id: String(user._id),
  username: user.username,
  fullName: user.fullName || user.username,
  role: user.role,
});

const getRedirectPath = (role) => (role === "admin" ? "/dashboard" : "/shop");

const login = asyncHandler(async (req, res) => {
  const username = String(req.body.username || "")
    .trim()
    .toLowerCase();
  const password = String(req.body.password || "").trim();

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập tên đăng nhập và mật khẩu.",
    });
  }

  const user = await User.findOne({ username });

  if (!user || !user.isActive || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({
      success: false,
      message: "Tên đăng nhập hoặc mật khẩu không chính xác.",
    });
  }

  req.session.user = buildSessionUser(user);

  return res.json({
    success: true,
    message: "Đăng nhập thành công.",
    data: req.session.user,
    redirectPath: getRedirectPath(user.role),
  });
});

const register = asyncHandler(async (req, res) => {
  const username = String(req.body.username || "")
    .trim()
    .toLowerCase();
  const email = String(req.body.email || "").trim().toLowerCase();
  const phone = String(req.body.phone || "").trim();
  const password = String(req.body.password || "").trim();
  const passwordConfirm = String(req.body.passwordConfirm || "").trim();

  // Xác thực dữ liệu
  if (!username || !email || !phone || !password || !passwordConfirm) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đầy đủ thông tin.",
    });
  }

  // Kiểm tra tên đăng nhập
  if (username.length < 3) {
    return res.status(400).json({
      success: false,
      message: "Tên đăng nhập phải có ít nhất 3 ký tự.",
    });
  }

  // Kiểm tra email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Email không hợp lệ.",
    });
  }

  // Kiểm tra số điện thoại
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Số điện thoại phải từ 10-11 chữ số.",
    });
  }

  // Kiểm tra mật khẩu có khớp không
  if (password !== passwordConfirm) {
    return res.status(400).json({
      success: false,
      message: "Mật khẩu không khớp.",
    });
  }

  // Xác thực độ mạnh mật khẩu
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Mật khẩu không đạt yêu cầu:",
      errors: passwordValidation.errors,
    });
  }

  // Kiểm tra xem tên đăng nhập đã tồn tại chưa
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Tên đăng nhập này đã được sử dụng.",
    });
  }

  // Kiểm tra xem email đã tồn tại chưa
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(409).json({
      success: false,
      message: "Email này đã được đăng ký.",
    });
  }

  // Tạo user mới
  const newUser = await User.create({
    username,
    fullName: "",
    email,
    phone,
    passwordHash: hashPassword(password),
    role: "user", // Mặc định role là user
  });

  // Tự động tạo thông tin Khách hàng (chỉ lưu email, số đt)
  // Họ tên và địa chỉ làm trống, khách hàng cập nhật sau
  await Customer.create({
    fullName: "",
    username,
    passwordHash: newUser.passwordHash,
    email,
    phone,
    address: "",
    city: "",
    district: "",
    ward: "",
    streetNumber: "",
    streetName: "",
    status: "active",
  });

  // Build session user
  req.session.user = buildSessionUser(newUser);

  return res.status(201).json({
    success: true,
    message: "Đăng ký thành công! Chào mừng bạn.",
    data: req.session.user,
    redirectPath: getRedirectPath(newUser.role),
  });
});

const logout = asyncHandler(async (req, res) => {
  if (!req.session) {
    return res.json({
      success: true,
      message: "Bạn đã đăng xuất.",
    });
  }

  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({
      success: true,
      message: "Đăng xuất thành công.",
    });
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const sessionUser = req.session?.user;

  if (!sessionUser?.id) {
    return res.json({
      success: true,
      authenticated: false,
      data: null,
    });
  }

  const user = await User.findById(sessionUser.id).select("-passwordHash");

  if (!user || !user.isActive) {
    req.session.destroy(() => {});
    return res.json({
      success: true,
      authenticated: false,
      data: null,
    });
  }

  req.session.user = buildSessionUser(user);

  return res.json({
    success: true,
    authenticated: true,
    data: req.session.user,
    redirectPath: getRedirectPath(user.role),
  });
});

module.exports = {
  login,
  register,
  logout,
  getCurrentUser,
};
