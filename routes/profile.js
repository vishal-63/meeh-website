const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");

const cartController = require("../controllers/cartController");
const userController = require("../controllers/userController");
const passwordController = require("../controllers/passwordController");

router.get("/", requireAuth, userController.profile_get);
router.post("/", requireAuth, userController.profile_post);

router.get("/add-new-address", requireAuth, (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("addNewAddress", { userLoggedIn });
});

router.post("/add-new-address", requireAuth, userController.save_address);

router.get("/change-password", requireAuth, async (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  res.render("changePassword", { userLoggedIn, cartLength });
});

router.post(
  "/change-password",
  requireAuth,
  passwordController.change_password_post
);

router.post("/forgotPassword", passwordController.forgot_password_post);
router.get(
  "/resetForgottenPassword",
  passwordController.reset_forgotten_password_get
);
router.post(
  "/resetForgottenPassword",
  passwordController.reset_forgotten_password_post
);

module.exports = router;
