const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  coupon_code: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 4,
  },
  percentage: {
    type: Number,
    max: 100,
  },
  max_discount: Number,
  min_total: Number,
  amount: Number,
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

const Coupon = mongoose.model("coupon", couponSchema);

module.exports = Coupon;
