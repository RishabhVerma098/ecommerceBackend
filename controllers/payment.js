const ErrorHandler = require("../utils/errorHandler.js");
const { v4: uuidv4 } = require("uuid");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: "rzp_test_AlHhGmZ4ggo3m9",
  key_secret: "m3f9nrdnL0i7xmAIXQEFEXj2",
});

/**
 * @description make payment
 * @param route POST /api/v1/payment/razorpay
 * @param access PUBLIC
 */
exports.makePayment = async (req, res, next) => {
  const payment_capture = 1;
  const amount = 499;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: uuidv4(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(`Problem occered in payment`, 500));
  }
};

/**
 * @description verify payment webhook
 * @param route POST /api/v1/payment/verification
 * @param access PUBLIC (but protected by secret key)
 */
exports.verifyPayment = async (req, res, next) => {
  // do a validation
  try {
    const secret = "12345678";

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    console.log(digest, req.headers["x-razorpay-signature"]);

    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      // process it
      require("fs").writeFileSync(
        "payment2.json",
        JSON.stringify(req.body, null, 4)
      );
    } else {
      // pass it
      next(new ErrorHandler(`Body and header not same`, 500));
    }
    res.json({ status: "ok" });
  } catch (error) {
    next(new ErrorHandler(`Error occured`, 500));
  }
};
