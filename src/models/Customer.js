const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Họ tên khách hàng là bắt buộc."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc."],
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc."],
      trim: true,
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
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

module.exports = mongoose.model("Customer", customerSchema);
