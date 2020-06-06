const express = require("express");
const {
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProduct,
} = require("../controllers/product");

const router = express.Router();

//imports
const advanceFiltering = require("../middleware/advanceFiltering.js");
const productModel = require("../models/product");

router
  .route("/")
  .get(advanceFiltering(productModel), getProducts)
  .post(createProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
