const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { verifyPassword } = require("../utils/password");

const buildSessionUser = (user) => ({
  id: String(user._id),
  username: user.username,
  fullName: user.fullName,
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
  logout,
  getCurrentUser,
};
