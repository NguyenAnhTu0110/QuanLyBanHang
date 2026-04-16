const createCrudController = require("./crudFactory");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const crudController = createCrudController(Product, {
  sort: { createdAt: -1 },
  populate: {
    path: "category",
    select: "name",
  },
});

// Ghi đè phương thức create để xử lý file upload
crudController.create = asyncHandler(async (req, res) => {
  const body = { ...req.body };

  // Nếu có file upload, lưu đường dẫn file
  if (req.file) {
    body.image = `/uploads/${req.file.filename}`;
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
  const body = { ...req.body };

  // Nếu có file upload, lưu đường dẫn file
  if (req.file) {
    body.image = `/uploads/${req.file.filename}`;
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
