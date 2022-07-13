const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const {requireAuth} = require("../middleware/authMiddleware");

router.get("/",requireAuth,cartController.cart_get);
router.post("/addToCart",requireAuth,cartController.cart_add_product);
router.post("/deleteFromCart",requireAuth,cartController.cart_delete_product);

// router.get("/");

module.exports = router;
