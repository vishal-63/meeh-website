const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user_id: {
    type: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    required: true,
  },
  products: {
    type: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Product",
      },
    ],
    minlength: 1,
  },
});

const Wishlist = mongoose.model("wishlist", wishlistSchema);

module.exports = Wishlist;
