const mongoose = require("mongoose");

const connectDatabase = async () => {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quanlybanhang_online";

  await mongoose.connect(mongoUri);
  console.log("Đã kết nối MongoDB thành công.");
};

module.exports = connectDatabase;
