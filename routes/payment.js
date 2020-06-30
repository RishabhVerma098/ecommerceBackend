const express = require("express");
const {
  makePayment,
  verifyPayment,
  updatePurchased,
} = require("../controllers/payment");

const router = express.Router();

router.route("/razorpay/:userId").post(makePayment);
router.route("/verification").post(verifyPayment);
router.route("/update/:productId").put(updatePurchased);

module.exports = router;
