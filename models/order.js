const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  house_no: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
  },
  pincode: {
    type: Number,
    minlength: 6,
    maxlength: 6,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  products: {
    type: [
      {
        product_id: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        total_amt: Number,
      },
    ],
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
  payment_status: {
    type: String,
    required: true,
  },
  shipping_cost: {
    type: Number,
    required: true,
  },
  shipping_address: {
    type: addressSchema,
    required: true,
  },
  shipping_status: {
    type: String,
    required: true,
  },
  razorpay_payment_id: String,
  razorpay_order_id: {
    type: String,
    required: true,
  },
  shiprocket_order_id: String,
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
