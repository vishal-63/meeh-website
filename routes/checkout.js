const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Product = require("../models/product");

const checkoutController = require("../controllers/checkoutController");
const { requireAuth } = require("../middleware/authMiddleware");
const paymentController = require("../controllers/paymentController");

router.get("/", requireAuth, async (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }
  const user = await User.findById(res.user.id);
  await user.populate({
    path: "cart.product_id",
    model: Product,
  });

  user.cart.map( (item) =>{
    item.product_total = item.product_id.price * item.quantity
  });

  console.log(user.cart);
  res.render("checkout", {
    userLoggedIn,
    cart: user.cart,
    address: user.addresses,
  });
});

router.post("/create-order", requireAuth, paymentController.create_order);
router.post("/verify-order", requireAuth, paymentController.verify_order);

module.exports = router;
