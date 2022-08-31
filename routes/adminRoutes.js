const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
// const {requireAuth} = require("../middleware/authMiddleware");


//product routes
router.get("/getProducts",adminController.get_products);

router.get("/getProduct/:id",adminController.get_single_product);

//user routes
router.get("/getUsers",adminController.get_users);

router.get("getUser/:id",adminController.get_single_user);

//order routes
router.get("/getOrders",adminController.get_orders);

router.get("/getOrder/:id",adminController.get_single_order);

//coupon routes
router.get("/getCoupons",adminController.get_coupons);

router.get("/getCoupon/:id",adminController.get_single_coupon);

//blog routes
router.get("/getBlogs",adminController.get_blogs);

router.get("/getBlog/:id",adminController.get_single_blog);

module.exports = router;