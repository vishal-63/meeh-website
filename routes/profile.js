const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const passwordController = require("../controllers/passwordController");


router.get("/", requireAuth, userController.profile_get);
router.post("/", requireAuth, userController.profile_post);

router.get("/change-password", requireAuth, (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("changePassword", { userLoggedIn });
});
// router.post("/changePassword",requireAuth,userController.change_password_post);

router.get("/forgotPassword", passwordController.forgot_password_get);
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
