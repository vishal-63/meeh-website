const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");

router.get("/terms-and-conditions", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("termsConditions", { userLoggedIn, cartLength });
});

router.get("/privacy-policy", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("privacyPolicy", { userLoggedIn, cartLength });
});

router.get("/shipping-policy", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("shippingPolicy", { userLoggedIn, cartLength });
});

router.get("/refund-policy", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("refundPolicy", { userLoggedIn, cartLength });
});

module.exports = router;
