const Razorpay = require("razorpay");
const crypto = require("crypto");

// Models
const Order = require("../models/order");
const User = require("../models/user");

// Controllers
const orderController = require("../controllers/orderController");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports.create_order = async (req, res) => {
  const order = await orderController.createDbOrder(
    res.user.id,
    req.body.cart,
    req.body.address
  );

  const user = await User.findById(res.user.id);
  const userDetails = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    phone_no: user.phone_no,
    shipping_address: req.body.address,
  };

  const amount = order.grand_total * 100;
  const currency = "INR";
  const receipt = order._id;
  const notes = {
    shipping_name: req.body.address.name,
    shipping_address: req.body.address.address,
    sub_total: order.sub_total,
    coupon_discount: order.coupon.discount,
  };

  try {
    razorpayInstance.orders.create(
      { amount, currency, receipt, notes },
      (err, result) => {
        if (!err) {
          const key = process.env.RAZORPAY_KEY;

          order.payment_status = "Pending";
          order.shipping_status = "Ordered";
          order.razorpay_order_id = result.id;

          order.save().catch((err) => {
            console.log(err);
            throw new Error(
              "An error occurred while creating your order. Please try again later!"
            );
          });
          res.json({ result, key, userDetails });
        } else {
          console.log(err);
          throw new Error(
            "An error occurred while creating your order. Please try again later!"
          );
        }
      }
    );
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

module.exports.verify_order = async (req, res) => {
  const { order_id, payment_id } = req.body;
  const razorpay_signature = req.headers["x-razorpay-signature"];

  const secret_key = process.env.RAZORPAY_SECRET;

  let hmac = crypto.createHmac("sha256", secret_key);
  hmac.update(order_id + "|" + payment_id);
  const generated_signature = hmac.digest("hex");

  if (razorpay_signature === generated_signature) {
    const order = await Order.findOne({ razorpay_order_id: order_id });
    order.payment_status = "Successful";

    order.save((err, order) => {
      if (err) console.log(err);
      else console.log(order);
    });

    res.json({ success: true, message: "Payment has been verified" });
  } else {
    res.json({ success: false, message: "Payment verification failed" });
  }
};
