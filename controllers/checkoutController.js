const User = require("../models/user");
const Product = require("../models/product");

module.exports.checkout_get = async (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  const user = await User.findById(res.user.id);
  await user.populate({
    path: "cart.product_id",
    model: Product,
  });

  const cart = user.cart;

  const address = req.cookies["address"];

  console.log(address);

  res.render("checkout", {
    cart,
    userLoggedIn,
    cartLength: cart.length,
    address,
  });
};

module.exports.checkout_post = async (req, res) => {
  res.cookie("address", req.body.address, { httpOnly: true });
  res.redirect("/checkout");
};
