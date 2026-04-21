const express = require("express");
const customerController = require("../controllers/customerController");

const router = express.Router();

// Read and Delete operations for admin
// Customers are auto-created during registration
// Admins can view customer data and delete if needed
router.route("/").get(customerController.getAll);
router.route("/:id").get(customerController.getById).delete(customerController.remove);

module.exports = router;
