const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const vietnamData = require("../utils/vietnamAddresses");

const getStoreProducts = asyncHandler(async (req, res) => {
  const data = await Product.find({ status: "active" })
    .populate("category", "name")
    .sort({ createdAt: -1 });

  return res.json({
    success: true,
    count: data.length,
    data,
  });
});

// Lấy thông tin khách hàng của user hiện tại
const getCurrentCustomer = asyncHandler(async (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Vui lòng đăng nhập.",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy thông tin người dùng.",
    });
  }

  const customer = await Customer.findOne({ email: user.email });
  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy thông tin khách hàng.",
    });
  }

  return res.json({
    success: true,
    data: customer,
  });
});

// Cập nhật thông tin khách hàng của user hiện tại
const updateCurrentCustomer = asyncHandler(async (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Vui lòng đăng nhập.",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy thông tin người dùng.",
    });
  }

  // Validate required fields
  const {
    fullName,
    provinceId,
    provinceName,
    districtId,
    districtName,
    wardId,
    wardName,
    streetNumber,
    streetName,
  } = req.body;

  if (!fullName || !fullName.trim()) {
    return res.status(400).json({
      success: false,
      message: "Họ và tên là bắt buộc.",
    });
  }

  if (
    !provinceId ||
    !provinceName ||
    !districtId ||
    !districtName ||
    !wardId ||
    !wardName
  ) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng chọn Tỉnh/Thành, Quận/Huyện, Phường/Xã.",
    });
  }

  if (!streetNumber || !streetNumber.trim() || !streetName || !streetName.trim()) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập số nhà và tên đường.",
    });
  }

  // Update customer
  const customer = await Customer.findOneAndUpdate(
    { email: user.email },
    {
      fullName: fullName.trim(),
      city: provinceName.trim(),
      district: districtName.trim(),
      ward: wardName.trim(),
      streetNumber: streetNumber.trim(),
      streetName: streetName.trim(),
      address: `${streetNumber.trim()} ${streetName.trim()}, ${wardName.trim()}, ${districtName.trim()}, ${provinceName.trim()}`,
      addresses: [
        {
          provinceId: String(provinceId).trim(),
          provinceName: provinceName.trim(),
          districtId: String(districtId).trim(),
          districtName: districtName.trim(),
          wardId: String(wardId).trim(),
          wardName: wardName.trim(),
          addressDetail: `${streetNumber.trim()} ${streetName.trim()}`.trim(),
          isDefault: true,
        },
      ],
    },
    { new: true, runValidators: true }
  );

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy thông tin khách hàng.",
    });
  }

  return res.json({
    success: true,
    message: "Cập nhật thông tin thành công.",
    data: customer,
  });
});

// Lấy danh sách tỉnh/thành
const getProvinces = asyncHandler(async (req, res) => {
  return res.json({
    success: true,
    data: vietnamData.provinces,
  });
});

// Lấy danh sách quận/huyện của tỉnh
const getDistricts = asyncHandler(async (req, res) => {
  const { provinceId } = req.params;

  if (!provinceId) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng cung cấp ID tỉnh/thành.",
    });
  }

  const districts = vietnamData.districts[provinceId] || [];

  return res.json({
    success: true,
    data: districts,
  });
});

// Lấy danh sách phường/xã của quận/huyện
const getWards = asyncHandler(async (req, res) => {
  const { districtId } = req.params;

  if (!districtId) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng cung cấp ID quận/huyện.",
    });
  }

  const wards = vietnamData.wards[districtId] || [];

  return res.json({
    success: true,
    data: wards,
  });
});

// Tạo đơn hàng từ shop
const createStoreOrder = asyncHandler(async (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Vui lòng đăng nhập.",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy thông tin người dùng.",
    });
  }

  const customer = await Customer.findOne({ email: user.email });
  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy thông tin khách hàng.",
    });
  }

  // Kiểm tra khách hàng có điền đầy đủ thông tin không
  if (!customer.fullName || !customer.address) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng cập nhật thông tin cá nhân trước khi đặt hàng.",
      requiresUpdate: true,
    });
  }

  // Validate request body
  const { items, paymentMethod, note } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng chọn ít nhất 1 sản phẩm.",
    });
  }

  if (!paymentMethod || !["cod", "bank_transfer", "card"].includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng chọn phương thức thanh toán hợp lệ.",
    });
  }

  // Validate and fetch products
  const productIds = [...new Set(items.map((item) => item.product))];
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    return res.status(400).json({
      success: false,
      message: "Có sản phẩm không tồn tại.",
    });
  }

  const productMap = new Map(products.map((item) => [String(item._id), item]));

  // Process order items
  const normalizedItems = items.map((item) => {
    const product = productMap.get(String(item.product));
    const quantity = Number(item.quantity);

    if (!product) {
      throw new Error("Sản phẩm không hợp lệ.");
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error("Số lượng sản phẩm phải lớn hơn 0.");
    }

    // Check stock
    if (product.stock < quantity) {
      throw new Error(`Sản phẩm "${product.name}" không đủ hàng (chỉ còn ${product.stock}).`);
    }

    return {
      product: product._id,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      lineTotal: quantity * product.price,
    };
  });

  const totalAmount = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);

  // Create order
  const orderPayload = {
    orderCode: `ORD-${Date.now()}`,
    customer: customer._id,
    items: normalizedItems,
    status: "preparing",
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
    shippingAddress: customer.address,
    note: note || "",
    totalAmount,
  };

  const createdOrder = await Order.create(orderPayload);

  await Promise.all(
    normalizedItems.map((item) =>
      Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      )
    )
  );

  // Populate order details
  let populatedOrder = await Order.findById(createdOrder._id)
    .populate("customer", "fullName email phone address city district ward")
    .populate("items.product", "name sku price");

  return res.status(201).json({
    success: true,
    message: "Đặt hàng thành công!",
    data: populatedOrder,
  });
});

module.exports = {
  getStoreProducts,
  getCurrentCustomer,
  updateCurrentCustomer,
  getProvinces,
  getDistricts,
  getWards,
  createStoreOrder,
};
