const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const passwordController = require("../controllers/passwordController1");

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

router.get("/change-password", requireAuth, (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("changePassword", { userLoggedIn });
});
// router.post("/changePassword",requireAuth,userController.change_password_post);

router.post("/forgotPassword", passwordController.forgot_password_post);
router.get("/resetForgottenPassword",passwordController.reset_forgotten_password_get);
router.post("/resetForgottenPassword",passwordController.reset_forgotten_password_post);

module.exports = router;
