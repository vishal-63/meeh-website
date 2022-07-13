const Blog = require("../models/blog");

module.exports.blogs_get = async (req, res) => {
  const blogList = await Blog.find();
  res.render("blogs", { blogList });
};

module.exports.single_product_get = async (req, res) => {
  const product = await Product.findById(req.params.id);
  // for(let i=0;i<product.reviews.length;i++){
  //     await product.populate(`reviews[${i}].user_id`);
  // }
  // console.log(product);
  res.render("productdetails", { product });
};
