const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Product = require("../models/product");

const checkoutController = require("../controllers/checkoutController");
const { requireAuth } = require("../middleware/authMiddleware");
const paymentController = require("../controllers/paymentController");

router.get("/", requireAuth, checkoutController.checkout_get);
router.get("/buy-now", requireAuth, checkoutController.checkout_buy_now);
router.post("/", requireAuth, checkoutController.checkout_post);
router.post("/create-order", requireAuth, paymentController.create_order);
router.post("/verify-order", requireAuth, paymentController.verify_order);

module.exports = router;
