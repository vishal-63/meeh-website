const Product = require("../models/product");

module.exports.products_get = async (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  const productList = await Product.find();
  res.render("products", { productList, userLoggedIn });
};

module.exports.single_product_get = async (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  const product = await Product.findById(req.params.id);
  res.render("productdetails", { product, userLoggedIn });
};
