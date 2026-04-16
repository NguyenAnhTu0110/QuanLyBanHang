require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");
const seedDefaultUsers = require("./config/seedUsers");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDatabase();
    await seedDefaultUsers();
    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Không thể khởi động server:", error.message);
    process.exit(1);
  }
};

startServer();
