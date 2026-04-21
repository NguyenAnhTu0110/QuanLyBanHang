const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

// Read, Delete operations for admin + payment status updates
// Orders are created via /api/store/orders endpoint by users
// Admins can view orders, delete orders and update payment/delivery status
router.route("/").get(orderController.getAllOrders);
router.route("/:id").get(orderController.getOrderById).delete(orderController.deleteOrder);

// Payment status update endpoint - admin can track payment collection
router.patch("/:id/payment-status", orderController.updatePaymentStatus);
router.patch("/:id/delivery-status", orderController.updateDeliveryStatus);

module.exports = router;
