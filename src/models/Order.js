const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Sản phẩm trong đơn hàng là bắt buộc."],
    },
    productName: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc."],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Số lượng là bắt buộc."],
      min: [1, "Số lượng phải lớn hơn 0."],
    },
    unitPrice: {
      type: Number,
      required: [true, "Đơn giá là bắt buộc."],
      min: [0, "Đơn giá không được âm."],
    },
    lineTotal: {
      type: Number,
      required: true,
      min: [0, "Thành tiền không được âm."],
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: [true, "Mã đơn hàng là bắt buộc."],
      trim: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Khách hàng là bắt buộc."],
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "Đơn hàng phải có ít nhất 1 sản phẩm.",
      },
    },
    status: {
      type: String,
      enum: ["preparing", "shipping", "success", "cancelled"],
      default: "preparing",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "bank_transfer", "card"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "received"],
      default: "pending",
    },
    shippingAddress: {
      type: String,
      required: [true, "Địa chỉ giao hàng là bắt buộc."],
      trim: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Tổng tiền không được âm."],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderSchema.pre("validate", function updateTotals(next) {
  if (Array.isArray(this.items)) {
    this.items.forEach((item) => {
      item.lineTotal = item.quantity * item.unitPrice;
    });

    this.totalAmount = this.items.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );
  }

  next();
});

module.exports = mongoose.model("Order", orderSchema);
