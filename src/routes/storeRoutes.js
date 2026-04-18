const express = require("express");
const {
  getStoreProducts,
  getCurrentCustomer,
  updateCurrentCustomer,
  getProvinces,
  getDistricts,
  getWards,
  createStoreOrder,
} = require("../controllers/storeController");

const router = express.Router();

router.get("/products", getStoreProducts);

// Customer information endpoints
router.get("/customer", getCurrentCustomer);
router.put("/customer", updateCurrentCustomer);

// Address data endpoints
router.get("/addresses/provinces", getProvinces);
router.get("/addresses/districts/:provinceId", getDistricts);
router.get("/addresses/wards/:districtId", getWards);

// Order creation
router.post("/orders", createStoreOrder);

module.exports = router;
