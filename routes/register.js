const { Router } = require("express");
const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController");
const categoryController = require("../controllers/categoryController");

const router = Router();

router.get("/", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);
  const categories = await categoryController.getCategories();

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("register", { userLoggedIn, categories, cartLength });
});

router.post("/", userController.signup_post);

// router.post("/google-sign-up", userController.googleSignUp);

module.exports = router;
