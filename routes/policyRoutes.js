const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const categoryController = require("../controllers/categoryController");

router.get("/terms-and-conditions", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);
  const categories = await categoryController.getCategories();

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("termsConditions", { userLoggedIn, cartLength, categories });
});

router.get("/privacy-policy", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);
  const categories = await categoryController.getCategories();

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("privacyPolicy", { userLoggedIn, cartLength, categories });
});

router.get("/shipping-policy", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);
  const categories = await categoryController.getCategories();

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("shippingPolicy", { userLoggedIn, cartLength, categories });
});

router.get("/refund-policy", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);
  const categories = await categoryController.getCategories();

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("refundPolicy", { userLoggedIn, cartLength, categories });
});

module.exports = router;
