const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.get("/", (req, res) => {
  res.render("register");
});

router.post("/", userController.signup_post);

// router.post("/google-sign-up", userController.googleSignUp);

module.exports = router;
