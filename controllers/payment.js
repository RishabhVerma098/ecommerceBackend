const ErrorHandler = require("../utils/errorHandler.js");
const { v4: uuidv4 } = require("uuid");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const productModel = require("../models/product");
const cartModel = require("../models/cart");

const razorpay = new Razorpay({
  key_id: process.env.PAYMENT_KEY_ID,
  key_secret: process.env.PAYMENT_KEY_SECRET,
});

/**
 * @description make payment
 * @param route POST /api/v1/payment/razorpay/:productId
 * @param access PRIVATE
 */
exports.makePayment = async (req, res, next) => {
  const id = req.params.productId;
  const { price } = await productModel.findById(id);

  if (!price) {
    next(new ErrorHandler(`product id is incorrect for payment`, 404));
  }

  const payment_capture = 1;
  const currency = "INR";

  const options = {
    amount: price * 100,
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
 * @param access PRIVATE (but protected by secret key)
 */
exports.verifyPayment = async (req, res, next) => {
  // do a validation
  try {
    const shasum = crypto.createHmac("sha256", process.env.PAYMENT);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      let body = JSON.stringify(req.body, null, 4);
      require("fs").writeFileSync("payment3.json", body);
    } else {
      // pass it
      next(new ErrorHandler(`Body and header not same`, 500));
    }
    res.json({ status: "ok" });
  } catch (error) {
    next(new ErrorHandler(`Error occured`, 500));
  }
};

/**
 * @description update a cart purchased
 * @param route PUT /api/v1/payment/update/:productId
 * @param access PRIVATE
 */
//TODO:ADD protect route ASAP
exports.updatePurchased = async (req, res, next) => {
  try {
    let cart = await cartModel.find({ product: req.params.productId });

    cart = cart[0];

    const body = {
      purchased: true,
    };

    const updatedCart = await cartModel.findByIdAndUpdate(cart._id, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      sucess: true,
      updatedCart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};
