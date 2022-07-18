const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const {requireAuth} = require("../middleware/authMiddleware");

router.get("/",requireAuth , checkoutController.checkout_get);
router.post("/",requireAuth , checkoutController.checkout_post);

module.exports = router;
