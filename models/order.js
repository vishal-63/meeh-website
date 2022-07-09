const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product",
  },
  quantity: Number,
  total_amt: Number,
})

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  products: {
    type: [{
      product_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      total_amt: Number,}],
    minlength: 1,
    required: true,
  },
  order_date: {
    type: Date,
    default: new Date(),
  },
  sub_total: {
    type: Number,
    required: true,
  },
  coupon: {
    type: {
      coupon_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Coupon",
      },
      discount: Number,
    },
  },
  grand_total: {
    type: Number,
    required: true,
  },
  order_status: {
    type: String,
    required: true,
  },
  payment_id: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;