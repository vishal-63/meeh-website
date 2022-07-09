const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  products: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Product",
    minlength: 1,
  },
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
