const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const storeRoutes = require("./routes/storeRoutes");
const {
  requireAuth,
  requireRole,
  requirePageRole,
  redirectIfAuthenticated,
} = require("./middleware/authMiddleware");

const app = express();
const publicPath = path.join(__dirname, "../public");
const pagePath = (...segments) => path.join(publicPath, ...segments);
const sendPage = (...segments) => (req, res) => res.sendFile(pagePath(...segments));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "quan-ly-ban-hang-online-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/store", requireAuth, storeRoutes);
app.use("/api/dashboard", requireAuth, requireRole("admin"), dashboardRoutes);
app.use("/api/categories", requireAuth, requireRole("admin"), categoryRoutes);
app.use("/api/products", requireAuth, requireRole("admin"), productRoutes);
app.use("/api/customers", requireAuth, requireRole("admin"), customerRoutes);
app.use("/api/orders", requireAuth, requireRole("admin"), orderRoutes);

app.use("/uploads", express.static(pagePath("uploads")));
app.use("/assets", express.static(pagePath("assets")));

app.get("/", (req, res) => {
  const role = req.session?.user?.role;

  if (!role) {
    return res.redirect("/login");
  }

  return res.redirect(role === "admin" ? "/dashboard" : "/shop");
});

app.get("/login", redirectIfAuthenticated, sendPage("login.html"));
app.get("/dashboard", requirePageRole("admin"), sendPage("index.html"));
app.get("/categories", requirePageRole("admin"), sendPage("pages", "categories.html"));
app.get("/products", requirePageRole("admin"), sendPage("pages", "products.html"));
app.get("/customers", requirePageRole("admin"), sendPage("pages", "customers.html"));
app.get("/orders", requirePageRole("admin"), sendPage("pages", "orders.html"));
app.get("/shop", requirePageRole("user"), sendPage("shop.html"));

app.get("/pages/categories.html", requirePageRole("admin"), sendPage("pages", "categories.html"));
app.get("/pages/products.html", requirePageRole("admin"), sendPage("pages", "products.html"));
app.get("/pages/customers.html", requirePageRole("admin"), sendPage("pages", "customers.html"));
app.get("/pages/orders.html", requirePageRole("admin"), sendPage("pages", "orders.html"));
app.get("/index.html", requirePageRole("admin"), sendPage("index.html"));
app.get("/shop.html", requirePageRole("user"), sendPage("shop.html"));
app.get("/login.html", redirectIfAuthenticated, sendPage("login.html"));

app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy endpoint API.",
    });
  }

  return res.status(404).send(`
    <html lang="vi">
      <head>
        <meta charset="UTF-8" />
        <title>404</title>
        <style>
          body { font-family: Arial, sans-serif; display: grid; place-items: center; min-height: 100vh; background: #f8f4ec; color: #222; }
          .box { text-align: center; padding: 32px; border-radius: 16px; background: white; box-shadow: 0 18px 40px rgba(0,0,0,.08); }
          a { color: #b7562f; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>404</h1>
          <p>Không tìm thấy trang bạn yêu cầu.</p>
          <a href="/">Quay về trang chính</a>
        </div>
      </body>
    </html>
  `);
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(", "),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "ID không hợp lệ.",
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: `Giá trị đã tồn tại: ${Object.keys(error.keyValue).join(", ")}`,
    });
  }

  console.error(error);
  return res.status(statusCode).json({
    success: false,
    message: error.message || "Có lỗi xảy ra trên server.",
  });
});

module.exports = app;
