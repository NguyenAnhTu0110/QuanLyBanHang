const mongoose = require("mongoose");

const customerAddressSchema = new mongoose.Schema(
  {
    provinceId: {
      type: String,
      required: [true, "Tỉnh/Thành là bắt buộc."],
      trim: true,
    },
    provinceName: {
      type: String,
      required: [true, "Tên Tỉnh/Thành là bắt buộc."],
      trim: true,
    },
    districtId: {
      type: String,
      required: [true, "Quận/Huyện là bắt buộc."],
      trim: true,
    },
    districtName: {
      type: String,
      required: [true, "Tên Quận/Huyện là bắt buộc."],
      trim: true,
    },
    wardId: {
      type: String,
      required: [true, "Phường/Xã là bắt buộc."],
      trim: true,
    },
    wardName: {
      type: String,
      required: [true, "Tên Phường/Xã là bắt buộc."],
      trim: true,
    },
    addressDetail: {
      type: String,
      required: [true, "Địa chỉ chi tiết là bắt buộc."],
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const formatAddress = (address) =>
  [
    address.addressDetail,
    address.wardName,
    address.districtName,
    address.provinceName,
  ]
    .filter(Boolean)
    .join(", ");

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: "",
      trim: true,
    },
    username: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    passwordHash: {
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
    district: {
      type: String,
      default: "",
      trim: true,
    },
    ward: {
      type: String,
      default: "",
      trim: true,
    },
    streetNumber: {
      type: String,
      default: "",
      trim: true,
    },
    streetName: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    addresses: {
      type: [customerAddressSchema],
      default: [],
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

customerSchema.pre("validate", function syncAddresses(next) {
  if (!Array.isArray(this.addresses)) {
    this.addresses = [];
  }

  if (this.addresses.length > 0) {
    const normalized = this.addresses.map((item, index) => ({
      ...item,
      isDefault: index === 0 ? true : Boolean(item.isDefault),
    }));

    // Always keep one default address at index 0.
    const defaultIndex = normalized.findIndex((item) => item.isDefault);
    if (defaultIndex > 0) {
      const [defaultAddress] = normalized.splice(defaultIndex, 1);
      normalized.unshift({ ...defaultAddress, isDefault: true });
      for (let i = 1; i < normalized.length; i += 1) {
        normalized[i].isDefault = false;
      }
    } else {
      normalized[0].isDefault = true;
      for (let i = 1; i < normalized.length; i += 1) {
        normalized[i].isDefault = false;
      }
    }

    this.addresses = normalized;

    const primaryAddress = normalized[0];
    this.city = primaryAddress.provinceName;
    this.district = primaryAddress.districtName;
    this.ward = primaryAddress.wardName;
    this.address = formatAddress(primaryAddress);

    next();
    return;
  }

  // Backward compatibility with legacy fields.
  if (this.city && this.district && this.ward && this.address) {
    this.addresses = [
      {
        provinceId: this.city,
        provinceName: this.city,
        districtId: this.district,
        districtName: this.district,
        wardId: this.ward,
        wardName: this.ward,
        addressDetail: this.streetNumber && this.streetName
          ? `${this.streetNumber} ${this.streetName}`.trim()
          : this.address,
        isDefault: true,
      },
    ];
  }

  next();
});

module.exports = mongoose.model("Customer", customerSchema);
