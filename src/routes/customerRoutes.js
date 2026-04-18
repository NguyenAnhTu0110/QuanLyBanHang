const express = require("express");
const customerController = require("../controllers/customerController");

const router = express.Router();

// Read-only operations for admin
// Customers are auto-created during registration
// Admins can only view customer data, not manually create/edit/delete
router.route("/").get(customerController.getAll);
router.route("/:id").get(customerController.getById);

module.exports = router;
