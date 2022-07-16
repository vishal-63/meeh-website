const Blog = require("../models/blog");

module.exports.blogs_get = async (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  const blogList = await Blog.find();
  res.render("blogs", { blogList, userLoggedIn });
};

module.exports.single_product_get = async (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  const product = await Product.findById(req.params.id);

  res.render("productdetails", { product, userLoggedIn });
};
