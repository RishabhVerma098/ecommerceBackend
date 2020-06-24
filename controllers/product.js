const productModel = require("../models/product");
const ErrorHandler = require("../utils/errorHandler.js");
/**
 * @description get all the products
 * @param route GET /api/v1/product
 * @param access PUBLIC
 */
exports.getProducts = async (req, res, next) => {
  try {
    res.status(200).json(res.advanceResults);
  } catch (error) {
    next(error);
  }
};

/**
 * @description get a single product
 * @param route GET /api/v1/product/:id
 * @param access PUBLIC
 */
exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return next(
        new ErrorHandler(`Product not find at Id:${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      sucess: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description create a product
 * @param route POST /api/v1/product
 * @param access PRIVATE
 */
exports.createProduct = async (req, res, next) => {
  try {
    const product = await productModel.create(req.body);

    res.status(200).json({
      sucess: true,
      createdData: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description update a product
 * @param route PUT /api/v1/product/:id
 * @param access PRIVATE
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) {
      return next(
        new ErrorHandler(`Product not find at Id:${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      sucess: true,
      updatedData: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description delete a product
 * @param route delete /api/v1/product/:id
 * @param access PRIVATE
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return next(
        new ErrorHandler(`Product not find at Id:${req.params.id}`, 404)
      );
    }
    product.remove();

    res.status(200).json({
      sucess: true,
      deletedData: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description filter product
 * @param route delete /api/v1/product/query
 * @param access PRIVATE
 */
exports.filterProduct = async (req, res, next) => {
  try {
    const product = await productModel.find({
      // platform: { $in: ["PS4", "XBOX"] },
      //company: { $in: ["Activision", "Respawn", "Ubisoft"] },
    });
    if (!product) {
      return next(new ErrorHandler(`my error`, 404));
    }

    res.status(200).json({
      couunt: product.length,
      sucess: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
