const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Tên đăng nhập là bắt buộc."],
      trim: true,
      lowercase: true,
      unique: true,
    },
    fullName: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc."],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ."],
    },
    phone: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc."],
      trim: true,
      match: [/^[0-9]{10,11}$/, "Số điện thoại phải từ 10-11 chữ số."],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
