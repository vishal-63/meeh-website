const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/order");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const User = require("../models/user");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports.create_order = async (req, res) => {

  let order = new Order();
  order.user_id = res.user.id;
  const user = await User.findById(res.user.id)
  const userDetails = {
    name: `${user.fist_name} ${user.last_name}`,
    email: user.email,
    phone_no: user.phone_no,
    shipping_address: req.body.shipping_address
  }

  try {
    const productPromises = [
      {
        id: "62c87554d1e70669ca1b4499",
        details: "S_f6f6f6",
        quantity: 40,
      },
      {
        id: "62c875ab28503cb136482c0c",
        details: "S_f6f6f6",
        quantity: 50,
      },
      {
        id: "62c875eba93d01aa26e5a4b8",
        details: "S_f6f6f6",
        quantity: 20,
      }].map(async function (p, index) {  
      return Product.findById(p.id).then(function (product) {
        return {
          product_id: product._id,
          details: p.details,
          quantity: p.quantity,
          total_amt: p.quantity * (product.price - product.discount)
        };
      });
    });
    order.products = await Promise.all(productPromises)
  
    order.sub_total = order.products.reduce(
      (sum, product) => sum + product.total_amt,
      0
    );
  
    let couponDiscount = 0;
    const coupon = await Coupon.findOne( {coupon_code: "RAKHI20"} );
    
    if (order.sub_total > coupon.min_total) {
      if (coupon.percentage) {
        couponDiscount =
          (order.sub_total * coupon.percentage) / 100 > coupon.max_discount
            ? coupon.max_discount
            : (order.sub_total * coupon.percentage) / 100;
      } else {
        couponDiscount = coupon.amount;
      }
    }
  
    order.coupon = {
      coupon_id: coupon._id,
      discount: couponDiscount,
    };
  
    order.grand_total = order.sub_total - order.coupon.discount;
  
    const amount = order.grand_total * 100;
    const currency = "INR";
    const receipt = order._id
    const notes = {
      shipping_address: userDetails.shipping_address
    }
  
    razorpayInstance.orders.create({ amount, currency, receipt, notes }, (err, result) => {
      if (!err) {
        const key = process.env.RAZORPAY_KEY
  
        order.payment_status = "Pending";
        order.shipping_status = "Ordered";
        order.razorpay_order_id = result.id
  
        order
          .save()
          .catch((err) => {
            console.log(err);
            throw new Error("An error occurred while creating your order. Please try again later!")
          });
  
        res.render("orderTest", { order: result, key, userDetails });
      } else {
        console.log(err);
        throw new Error("An error occurred while creating your order. Please try again later!")
      }
    });
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }
};

module.exports.verify_order = async (req, res) => {
  const { order_id, payment_id } = req.body;
  const razorpay_signature = req.headers['x-razorpay-signature']

  const secret_key = process.env.RAZORPAY_SECRET

  let hmac = crypto.createHmac('sha256', secret_key)
  hmac.update(order_id + "|" + payment_id)
  const generated_signature = hmac.digest("hex")

  if(razorpay_signature === generated_signature) {
    const order = await Order.findOne({razorpay_order_id: order_id})
    order.payment_status = "Successful"

    order.save((err, order) => {
      if(err)
        console.log(err)
      else
        console.log(order)
    })

    res.json({success:true, message:"Payment has been verified"})
  } else {
    res.json({success:false, message:"Payment verification failed"})
  }
}
