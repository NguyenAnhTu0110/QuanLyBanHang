const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc."],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU là bắt buộc."],
      trim: true,
      uppercase: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Danh mục là bắt buộc."],
    },
    price: {
      type: Number,
      required: [true, "Giá bán là bắt buộc."],
      min: [0, "Giá bán không được âm."],
    },
    stock: {
      type: Number,
      required: [true, "Số lượng tồn là bắt buộc."],
      min: [0, "Số lượng tồn không được âm."],
      default: 0,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Product", productSchema);
