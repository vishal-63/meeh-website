const User = require("../models/user");
const Product = require("../models/product");

const categoryController = require("../controllers/categoryController");

module.exports.checkout_get = async (req, res) => {
  let userLoggedIn = false;
  const categories = await categoryController.getCategories();

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  const user = await User.findById(res.user.id);
  await user.populate({
    path: "cart.product_id",
    model: Product,
  });

  const cart = user.cart;

  const address = req.cookies.address;

  res.render("checkout", {
    cart,
    userLoggedIn,
    categories,
    cartLength: cart.length,
    address,
  });
};

module.exports.checkout_post = async (req, res) => {
  const address = req.body.address;
  res.cookie("address", address);
  res.redirect("/checkout");
};

module.exports.checkout_buy_now = async (req, res) => {
  let userLoggedIn = false;
  const categories = await categoryController.getCategories();

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  const user = await User.findById(res.user.id);
  const addresses = user.addresses;

  const productToBuy = JSON.parse(req.cookies.product);
  const product = await Product.findById(productToBuy.id);

  res.render("buy-now", {
    userLoggedIn,
    product,
    quantity: productToBuy.quantity,
    addresses,
    categories,
  });
};
