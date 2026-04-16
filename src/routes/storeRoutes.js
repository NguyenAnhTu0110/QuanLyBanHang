const express = require("express");
const { getStoreProducts } = require("../controllers/storeController");

const router = express.Router();

router.get("/products", getStoreProducts);

module.exports = router;
