const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", cartController.cart_get);
router.get("/shipping", cartController.cart_shipping_get);
router.get("/information", cartController.cart_information_get);
router.post("/addToCart", requireAuth, cartController.cart_add_product);
router.post("/deleteFromCart", requireAuth, cartController.cart_delete_product);
// router.post("/updateCart", requireAuth, cartController.cart_update_product);
router.post("/updateCart", requireAuth, async (req, res) => {
  console.log("api hit");
});

module.exports = router;
