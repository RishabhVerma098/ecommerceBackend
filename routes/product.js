const express = require("express");
const {
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProduct,
  filterProduct,
} = require("../controllers/product");

const router = express.Router();

//imports
const advanceFiltering = require("../middleware/advanceFiltering.js");
const productModel = require("../models/product");
const { protectRoute } = require("../middleware/auth.js");

router
  .route("/")
  .get(advanceFiltering(productModel), getProducts)
  .post(protectRoute, createProduct);
router.route("/filter").post(filterProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .put(protectRoute, updateProduct)
  .delete(protectRoute, deleteProduct);

module.exports = router;
