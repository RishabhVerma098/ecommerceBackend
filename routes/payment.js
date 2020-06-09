const express = require("express");
const { makePayment, verifyPayment } = require("../controllers/payment");

const router = express.Router();

router.route("/razorpay").post(makePayment);
router.route("/verification").post(verifyPayment);

module.exports = router;
