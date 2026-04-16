const express = require("express");
const productController = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.route("/").get(productController.getAll).post(upload.single("image"), productController.create);
router
  .route("/:id")
  .get(productController.getById)
  .put(upload.single("image"), productController.update)
  .delete(productController.remove);

module.exports = router;
