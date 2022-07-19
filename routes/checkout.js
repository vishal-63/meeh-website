const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const { requireAuth } = require("../middleware/authMiddleware");
const paymentController = require("../controllers/paymentController");

router.get("/", requireAuth, (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }
  res.render("checkout", { userLoggedIn });
});

router.get("/create-order", requireAuth, paymentController.create_order);
router.post("/verify-order", paymentController.verify_order);

module.exports = router;
