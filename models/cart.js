const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    savedForLater: {
      type: Boolean,
      default: false,
    },
    order_Id: {
      type: String,
    },
    purchased: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// cartSchema.methods.addOrderId = async function (orderId) {
//   this.order_Id = orderId;

//   return null;
// };

module.exports = mongoose.model("Cart", cartSchema);
