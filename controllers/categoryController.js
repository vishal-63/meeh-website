const Category = require("../models/category");

module.exports.getCategories = async () => {
  const categories = await Category.find();
  return categories;
};
