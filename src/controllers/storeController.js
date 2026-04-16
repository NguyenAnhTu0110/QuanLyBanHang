const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

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

module.exports = {
  getStoreProducts,
};
