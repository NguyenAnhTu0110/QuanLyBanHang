const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const redirectByRole = (res, role) =>
  res.redirect(role === "admin" ? "/dashboard" : "/shop");

const loadSessionUser = async (sessionUser) => {
  if (!sessionUser?.id) {
    return null;
  }

  const user = await User.findById(sessionUser.id).select("-passwordHash");

  if (!user || !user.isActive) {
    return null;
  }

  return user;
};

const requireAuth = asyncHandler(async (req, res, next) => {
  const user = await loadSessionUser(req.session?.user);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Bạn cần đăng nhập để tiếp tục.",
    });
  }

  req.user = user;
  next();
});

const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập khu vực này.",
      });
    }

    next();
  };

const redirectIfAuthenticated = (req, res, next) => {
  const role = req.session?.user?.role;

  if (!role) {
    return next();
  }

  return redirectByRole(res, role);
};

const requirePageRole =
  (...roles) =>
  async (req, res, next) => {
    try {
      const user = await loadSessionUser(req.session?.user);

      if (!user) {
        return res.redirect("/login");
      }

      if (!roles.includes(user.role)) {
        return redirectByRole(res, user.role);
      }

      req.user = user;
      return next();
    } catch (error) {
      return next(error);
    }
  };

module.exports = {
  requireAuth,
  requireRole,
  requirePageRole,
  redirectIfAuthenticated,
};
