const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.get("/", (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("register", { userLoggedIn });
});

router.post("/", userController.signup_post);

// router.post("/google-sign-up", userController.googleSignUp);

module.exports = router;
