const createCrudController = require("./crudFactory");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");

const crudController = createCrudController(Product, {
  sort: { createdAt: -1 },
  populate: {
    path: "category",
    select: "name",
  },
});

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

// Parse create payload: require full fields
const parseCreateData = (data) => {
  const result = {
    name: String(data.name || "").trim(),
    sku: String(data.sku || "").trim(),
    category: String(data.category || "").trim(),
    status: String(data.status || "active").trim() || "active",
    price: toNumber(data.price),
    stock: toNumber(data.stock),
    description: String(data.description || "").trim(),
  };
  // Only add imageUrl if explicitly provided and not empty
  if (data.imageUrl && String(data.imageUrl).trim()) {
    result.imageUrl = String(data.imageUrl).trim();
  }
  return result;
};

// Parse update payload: only keep provided fields
const parseUpdateData = (data) => {
  const body = {};

  if (Object.prototype.hasOwnProperty.call(data, "name")) {
    body.name = String(data.name || "").trim();
  }
  if (Object.prototype.hasOwnProperty.call(data, "sku")) {
    body.sku = String(data.sku || "").trim();
  }
  if (Object.prototype.hasOwnProperty.call(data, "category")) {
    body.category = String(data.category || "").trim();
  }
  if (Object.prototype.hasOwnProperty.call(data, "status")) {
    body.status = String(data.status || "active").trim() || "active";
  }
  if (Object.prototype.hasOwnProperty.call(data, "price")) {
    body.price = toNumber(data.price);
  }
  if (Object.prototype.hasOwnProperty.call(data, "stock")) {
    body.stock = toNumber(data.stock);
  }
  if (Object.prototype.hasOwnProperty.call(data, "imageUrl") && String(data.imageUrl || "").trim()) {
    body.imageUrl = String(data.imageUrl).trim();
  }
  if (Object.prototype.hasOwnProperty.call(data, "description")) {
    body.description = String(data.description || "").trim();
  }

  return body;
};

// Ghi đè phương thức create để xử lý file upload
crudController.create = asyncHandler(async (req, res) => {
  const body = parseCreateData(req.body);

  // Validate required fields
  if (!body.name) {
    return res.status(400).json({
      success: false,
      message: "Tên sản phẩm là bắt buộc.",
    });
  }

  if (!body.sku) {
    return res.status(400).json({
      success: false,
      message: "SKU là bắt buộc.",
    });
  }

  if (!body.category) {
    return res.status(400).json({
      success: false,
      message: "Danh mục là bắt buộc.",
    });
  }

  if (!Number.isFinite(body.price) || body.price <= 0) {
    return res.status(400).json({
      success: false,
      message: "Giá bán phải lớn hơn 0.",
    });
  }

  if (!Number.isFinite(body.stock) || body.stock < 0) {
    return res.status(400).json({
      success: false,
      message: "Tồn kho phải lớn hơn hoặc bằng 0.",
    });
  }

  // Nếu có file upload, lưu đường dẫn file (ưu tiên file upload hơn imageUrl)
  if (req.file) {
    const uploadedPath = `/uploads/${req.file.filename}`;
    body.image = uploadedPath;
    body.imageUrl = uploadedPath;
  } else if (!body.imageUrl) {
    body.image = "";
    body.imageUrl = "";
  }

  const createdItem = await Product.create(body);
  let data = createdItem;

  // Populate category nếu cần
  let query = Product.findById(createdItem._id).populate({
    path: "category",
    select: "name",
  });
  data = await query;

  res.status(201).json({
    success: true,
    message: "Tạo mới thành công.",
    data,
  });
});

// Ghi đè phương thức update để xử lý file upload
crudController.update = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "ID sản phẩm không hợp lệ.",
    });
  }

  const body = parseUpdateData(req.body);

  // Validate required fields if they're being updated
  if (Object.prototype.hasOwnProperty.call(body, "name") && !body.name) {
    return res.status(400).json({
      success: false,
      message: "Tên sản phẩm không được để trống.",
    });
  }

  if (Object.prototype.hasOwnProperty.call(body, "sku") && !body.sku) {
    return res.status(400).json({
      success: false,
      message: "SKU không được để trống.",
    });
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "price") &&
    (!Number.isFinite(body.price) || body.price <= 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "Giá bán phải lớn hơn 0.",
    });
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "stock") &&
    (!Number.isFinite(body.stock) || body.stock < 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "Tồn kho phải lớn hơn hoặc bằng 0.",
    });
  }

  // Nếu có file upload, lưu đường dẫn file (ưu tiên file upload hơn imageUrl)
  if (req.file) {
    const uploadedPath = `/uploads/${req.file.filename}`;
    body.image = uploadedPath;
    body.imageUrl = uploadedPath;
  }

  let query = Product.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  }).populate({
    path: "category",
    select: "name",
  });

  const data = await query;

  if (!data) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy bản ghi để cập nhật.",
    });
  }

  return res.json({
    success: true,
    message: "Cập nhật thành công.",
    data,
  });
});

module.exports = crudController;

