const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

// Read-only operations for admin + payment status updates
// Orders are created via /api/store/orders endpoint by users
// Admins can only view orders and update payment status
router.route("/").get(orderController.getAllOrders);
router.route("/:id").get(orderController.getOrderById);

// Payment status update endpoint - admin can track payment collection
router.patch("/:id/payment-status", orderController.updatePaymentStatus);
router.patch("/:id/delivery-status", orderController.updateDeliveryStatus);

module.exports = router;
