const express = require("express");
const { getDashboardStats } = require("../controllers/orderController");

const router = express.Router();

router.get("/stats", getDashboardStats);

module.exports = router;
