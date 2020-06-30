const ErrorHandler = require("../utils/errorHandler.js");
const { v4: uuidv4 } = require("uuid");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const productModel = require("../models/product");
const cartModel = require("../models/cart");
const cart = require("../models/cart");

const razorpay = new Razorpay({
  key_id: process.env.PAYMENT_KEY_ID,
  key_secret: process.env.PAYMENT_KEY_SECRET,
});

/**
 * @description make payment
 * @param route POST /api/v1/payment/razorpay/:userId
 * @param access PRIVATE
 */
exports.makePayment = async (req, res, next) => {
  //* list of product ids
  const ids = req.body.id;

  //* list of all the products
  const products = [];
  for (let i = 0; i < ids.length; i++) {
    const product = await productModel.find({ _id: ids[i] });
    products.push(product[0]);
  }

  //* extract price with off , caculate total amount
  let finalPrice = 0;
  for (let i = 0; i < products.length; i++) {
    const price = (products[i].price * products[i].offer) / 100;
    finalPrice = finalPrice + price;
  }

  const payment_capture = 1;
  const currency = "INR";

  const options = {
    amount: finalPrice * 100,
    currency,
    receipt: uuidv4(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);

    //* here get cart_item and update the order_Id field from response
    for (let i = 0; i < products.length; i++) {
      await cartModel.updateOne(
        {
          user: req.params.userId,
          product: products[i],
        },
        { order_Id: response.id }
      );
    }

    // * then the flow will move to verify payment by webhook

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
  // * where once verified , get the cart_Item by ORDER_ID and update purchased to true
  // ! At last call FIX 'my game' route to get games who has purchased true , currently we are getting all the items present in the cart
  // do a validation
  try {
    const shasum = crypto.createHmac("sha256", process.env.PAYMENT);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      let body = JSON.stringify(req.body, null, 4);
      //* where once verified , get the cart_Item by ORDER_ID and update purchased to true

      const ans = await cartModel.updateMany(
        {
          order_Id: req.body.payload.payment.entity.order_id.toString(),
        },
        { purchased: true }
      );

      console.log("hhelo", ans);
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
