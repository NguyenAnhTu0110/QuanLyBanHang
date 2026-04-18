const User = require("../models/User");
const { hashPassword } = require("../utils/password");

const defaultUsers = [
  {
    username: "admin",
    fullName: "Quản trị viên",
    password: "admin123",
    role: "admin",
  },
  {
    username: "user",
    fullName: "Khách hàng mẫu",
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
      passwordHash: hashPassword(account.password),
      role: account.role,
      isActive: true,
    });
  }
};

module.exports = seedDefaultUsers;
