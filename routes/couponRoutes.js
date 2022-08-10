const {Router} = require("express");
const router = Router();
const couponController = require("../controllers/couponController");

router.get("/setCoupon",couponController.get_coupon_set);

module.exports = router;