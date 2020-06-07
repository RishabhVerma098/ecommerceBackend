const express = require("express");
const { getCartItems, createCartItem } = require("../controllers/cart");

const router = express.Router();

//imports
const advanceFiltering = require("../middleware/advanceFiltering.js");
const cartModel = require("../models/cart");
const { protectRoute } = require("../middleware/auth.js");

router
  .route("/")
  .get(protectRoute, advanceFiltering(cartModel, "product"), getCartItems);

router.route("/:productId").post(protectRoute, createCartItem);

module.exports = router;
