const express = require("express");
const customerController = require("../controllers/customerController");

const router = express.Router();

router.route("/").get(customerController.getAll).post(customerController.create);
router
  .route("/:id")
  .get(customerController.getById)
  .put(customerController.update)
  .delete(customerController.remove);

module.exports = router;
