const productModel = require("../models/product");
const cartModel = require("../models/cart");
const ErrorHandler = require("../utils/errorHandler.js");

/**
 * @description get product game
 * @param route GET /api/v1/mygame
 * @param access PRIVATE
 */
exports.getMyGames = async (req, res, next) => {
  try {
    const cart_items = await cartModel.find({
      user: req.user.id.toString(),
      purchased: true,
    });

    console.log(cart_items, "ietms");
    let games = [];

    //TODO:change only display those who have sucess true

    for (let i = 0; i < cart_items.length; i++) {
      const product = await productModel
        .find({ _id: cart_items[i].product.toString() })
        .select("+gameFile");
      games.push(product);
    }

    console.log(games);

    res.status(200).json({
      sucess: true,
      games: games,
    });
  } catch (error) {
    next(error);
  }
};
