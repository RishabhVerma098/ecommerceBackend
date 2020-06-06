const ErrorHandler = require("../utils/errorHandler.js");
const userModel = require("../models/User.js");
const sendEmail = require("../utils/sendmail");
const crypto = require("crypto");
/**
 * @description register user
 * @param route POST /api/v1/auth/register
 * @param access PRIVATE
 */
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.create({
      name,
      email,
      password,
    });

    const token = user.getSignedJwtToken();

    res.status(200).json({
      sucess: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description login user
 * @param route POST /api/v1/auth/login
 * @param access PRIVATE
 */
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //validate email and password
    if (!email || !password) {
      return next(new ErrorHandler("Please provide email password", 400));
    }

    //check for user
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }

    //check password
    const isMatch = await user.matchpasswords(password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }

    //NOTE: static are called on model so , it will called upon userModel
    //methods are called on the actual user data , so it will call on 'user'

    const token = user.getSignedJwtToken();

    res.status(200).json({
      sucess: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description check myself
 * @param route POST /api/v1/auth/me
 * @param access PRIVATE
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
      sucess: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description forget password
 * @param route POST /api/v1/auth/forgetpassword
 * @param access PRIVATE
 */
exports.forgetpassword = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return next(new ErrorHandler(`User is not present`, 404));
    }

    const resetToken = user.getResetToken();

    await user.save({ validateBeforeSave: false });

    //create url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "password reset token",
        message: `you have requested to reset password , please make PUT to ${resetUrl}`,
      });
      res.status(200).json({
        sucess: true,
        data: "reset password mail sent",
      });
    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      next(new ErrorHandler(`email could not be sent`, 500));
    }

    res.status(200).json({
      sucess: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description reset password
 * @param route PUT /api/v1/auth/resetpassword/:resettoken
 * @param access PRIVATE
 */
exports.resetpassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken,

      //our resetpassowrdExpire should be greater than present time
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return next(new ErrorHandler(`Invalid token`, 404));
    }

    //replace old password with new one
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = user.getSignedJwtToken();

    res.status(200).json({
      sucess: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};
