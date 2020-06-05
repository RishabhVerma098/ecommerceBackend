//*FIXME:Add errorHandler , advanceFiltering
/**
 * @description get all the products
 * @param route GET /api/v1/product
 * @param access PUBLIC
 */
exports.getProducts = async (req, res, next) => {
  try {
    res.status(200).json({
      sucess: true,
      data: "all products",
    });
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
    res.status(200).json({
      sucess: true,
      data: "get a product",
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
//TODO:Add Auth
exports.createProduct = async (req, res, next) => {
  try {
    res.status(200).json({
      sucess: true,
      data: "create a product",
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
//TODO:Add Auth
exports.updateProduct = async (req, res, next) => {
  try {
    res.status(200).json({
      sucess: true,
      data: "update a product",
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
//TODO:Add Auth
exports.deleteProduct = async (req, res, next) => {
  try {
    res.status(200).json({
      sucess: true,
      data: "delete a product",
    });
  } catch (error) {
    next(error);
  }
};
