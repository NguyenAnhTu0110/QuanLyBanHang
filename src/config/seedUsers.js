const User = require("../models/User");
const { hashPassword } = require("../utils/password");

const defaultUsers = [
  {
    username: "admin",
    fullName: "Quản trị viên",
    email: "admin@example.com",
    phone: "0123456789",
    password: "admin123",
    role: "admin",
  },
  {
    username: "user",
    fullName: "Khách hàng mẫu",
    email: "user@example.com",
    phone: "0987654321",
    password: "user123",
    role: "user",
  },
];

const seedDefaultUsers = async () => {
  for (const account of defaultUsers) {
    const exists = await User.findOne({ username: account.username });

    if (exists) {
      continue;
    }

    await User.create({
      username: account.username,
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      passwordHash: hashPassword(account.password),
      role: account.role,
      isActive: true,
    });
  }
};

module.exports = seedDefaultUsers;
