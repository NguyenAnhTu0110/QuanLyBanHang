const Category = require("../models/Category");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const orderPopulate = [
  {
    path: "customer",
    select: "fullName email phone city",
  },
  {
    path: "items.product",
    select: "name sku price stock",
  },
];

const createHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const applyPopulate = (query) =>
  orderPopulate.reduce(
    (currentQuery, populateOption) => currentQuery.populate(populateOption),
    query
  );

const buildOrderPayload = async (payload, fallbackOrderCode) => {
  if (!payload.customer) {
    throw createHttpError("Vui lòng chọn khách hàng.");
  }

  const customer = await Customer.findById(payload.customer);
  if (!customer) {
    throw createHttpError("Khách hàng không tồn tại.");
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw createHttpError("Đơn hàng phải có ít nhất 1 sản phẩm.");
  }

  const productIds = [...new Set(payload.items.map((item) => item.product))];
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw createHttpError("Có sản phẩm không tồn tại trong đơn hàng.");
  }

  const productMap = new Map(products.map((item) => [String(item._id), item]));

  const normalizedItems = payload.items.map((item) => {
    const product = productMap.get(String(item.product));
    const quantity = Number(item.quantity);

    if (!product) {
      throw createHttpError("Sản phẩm không hợp lệ trong danh sách mua.");
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw createHttpError("Số lượng sản phẩm phải lớn hơn 0.");
    }

    const inputPrice = Number(item.unitPrice);
    const unitPrice = Number.isFinite(inputPrice) && inputPrice >= 0 ? inputPrice : product.price;

    return {
      product: product._id,
      productName: product.name,
      quantity,
      unitPrice,
      lineTotal: quantity * unitPrice,
    };
  });

  const totalAmount = normalizedItems.reduce(
    (sum, item) => sum + item.lineTotal,
    0
  );

  return {
    orderCode: fallbackOrderCode || payload.orderCode || `ORD-${Date.now()}`,
    customer: payload.customer,
    items: normalizedItems,
    status: payload.status || "pending",
    paymentMethod: payload.paymentMethod || "cod",
    shippingAddress: payload.shippingAddress || customer.address || "Chưa cập nhật",
    note: payload.note || "",
    orderDate: payload.orderDate || new Date(),
    totalAmount,
  };
};

const getAllOrders = asyncHandler(async (req, res) => {
  let query = Order.find();
  query = applyPopulate(query);
  const data = await query.sort({ createdAt: -1 });

  res.json({
    success: true,
    count: data.length,
    data,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  let query = Order.findById(req.params.id);
  query = applyPopulate(query);
  const data = await query;

  if (!data) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy đơn hàng.",
    });
  }

  return res.json({
    success: true,
    data,
  });
});

const createOrder = asyncHandler(async (req, res) => {
  const orderPayload = await buildOrderPayload(req.body);
  const createdOrder = await Order.create(orderPayload);
  let query = Order.findById(createdOrder._id);
  query = applyPopulate(query);
  const data = await query;

  return res.status(201).json({
    success: true,
    message: "Tạo đơn hàng thành công.",
    data,
  });
});

const updateOrder = asyncHandler(async (req, res) => {
  const existingOrder = await Order.findById(req.params.id);

  if (!existingOrder) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy đơn hàng để cập nhật.",
    });
  }

  const orderPayload = await buildOrderPayload(req.body, existingOrder.orderCode);

  let query = Order.findByIdAndUpdate(req.params.id, orderPayload, {
    new: true,
    runValidators: true,
  });
  query = applyPopulate(query);
  const data = await query;

  return res.json({
    success: true,
    message: "Cập nhật đơn hàng thành công.",
    data,
  });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const deletedOrder = await Order.findByIdAndDelete(req.params.id);

  if (!deletedOrder) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy đơn hàng để xóa.",
    });
  }

  return res.json({
    success: true,
    message: "Xóa đơn hàng thành công.",
  });
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const [categoryCount, productCount, customerCount, orderCount] = await Promise.all([
    Category.countDocuments(),
    Product.countDocuments(),
    Customer.countDocuments(),
    Order.countDocuments(),
  ]);

  const revenueResult = await Order.aggregate([
    {
      $match: {
        status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("customer", "fullName");

  const lowStockProducts = await Product.find({ stock: { $lte: 10 } })
    .sort({ stock: 1 })
    .limit(5)
    .populate("category", "name");

  return res.json({
    success: true,
    data: {
      counts: {
        categories: categoryCount,
        products: productCount,
        customers: customerCount,
        orders: orderCount,
      },
      totalRevenue: revenueResult[0]?.totalRevenue || 0,
      recentOrders,
      lowStockProducts,
    },
  });
});

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getDashboardStats,
};
