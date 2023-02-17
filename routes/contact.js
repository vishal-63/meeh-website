const express = require("express");
const router = express.Router();

const contactusController = require("../controllers/contactusController");
const cartController = require("../controllers/cartController");
const categoryController = require("../controllers/categoryController");

router.get("/", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);
  const categories = await categoryController.getCategories();

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("contact", { userLoggedIn, categories, cartLength });
});

router.post("/", contactusController.send_mail);

module.exports = router;
