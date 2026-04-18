const express = require("express");
const productController = require("../controllers/productController");
const { uploadWrapper } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.route("/").get(productController.getAll).post(uploadWrapper, productController.create);
router
  .route("/:id")
  .get(productController.getById)
  .put(uploadWrapper, productController.update)
  .delete(productController.remove);

module.exports = router;
