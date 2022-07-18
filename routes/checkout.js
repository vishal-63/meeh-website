const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", requireAuth, (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }
  res.render("checkout", { userLoggedIn });
});

module.exports = router;
