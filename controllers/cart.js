const cartModel = require("../models/cart");
const ErrorHandler = require("../utils/errorHandler.js");

/**
 * @description get cart items of the logged in user
 * @param route GET /api/v1/cart
 * @param access PRIVATE
 */
exports.getCartItems = async (req, res, next) => {
  try {
    let results = res.advanceResults.data;
    let id = req.user.id;

    const data = results.filter(function (value) {
      if (value.user._id.toString() === id) {
        return value;
      }
    });
    res.status(200).json({
      sucess: res.advanceResults.sucess,
      count: data.length,
      pagination: res.advanceResults.pagination,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description create a cart item
 * @param route POST /api/v1/cart/:productId
 * @param access PRIVATE
 */
//TODO:Add Auth
exports.createCartItem = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    req.body.product = req.params.productId;

    const product = await cartModel.create(req.body);

    res.status(200).json({
      sucess: true,
      createdData: product,
    });
  } catch (error) {
    next(error);
  }
};
