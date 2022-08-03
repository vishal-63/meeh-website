const jwt = require("jsonwebtoken");

const Product = require("../models/product");
const User = require("../models/user");

const cartController = require("../controllers/cartController");

module.exports.products_get = async (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  const productList = await Product.find().limit(5);
  res.render("products", { productList, userLoggedIn });
};

module.exports.single_product_get = async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  const product = await Product.findById(req.params.id);
  res.render("productdetails", { product, userLoggedIn, cartLength });
};
