const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.get("/", (req, res) => {
  res.render("register");
});

router.post("/", userController.signup_post);

module.exports = router;
