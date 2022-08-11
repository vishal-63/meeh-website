const { Router } = require("express");
const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController");

const router = Router();

router.get("/", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("register", { userLoggedIn, cartLength });
});

router.post("/", userController.signup_post);

// router.post("/google-sign-up", userController.googleSignUp);

module.exports = router;
