const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const cors = require("cors");

//login route:-
router.post("/login", adminController.login);

router.get("/imagekit-auth", adminController.imagekitAuth);
router.put("/deleteImage", adminController.delete_image);

//product routes
router.get("/getProducts", adminController.get_products);
router.get("/getProduct/:id", adminController.get_single_product);
router.put("/changeProductState/:id", adminController.change_product_state);
router.put("/setProduct/:id", adminController.set_single_product);
router.delete("/deleteProduct/:id", adminController.delete_product);
router.post("/addProduct", adminController.post_add_product);

//user routes
router.get("/getUsers", adminController.get_users);
router.get("/getUser/:id", adminController.get_single_user);
router.post("/setUser", adminController.set_single_user);

//order routes
router.get("/getOrders", adminController.get_orders);
router.get("/getOrder/:id", adminController.get_single_order);

//coupon routes
router.get("/getCoupons", adminController.get_coupons);
router.get("/getCoupon/:id", adminController.get_single_coupon);
router.put("/changeCouponState/:id", adminController.change_coupon_state);
router.put("/setCoupon/:id", adminController.set_coupons);
router.post("/addCoupon", adminController.add_coupon);

// category routes
router.get("/getCategories", adminController.get_categories);
router.post("/updateCategory", adminController.update_category);
router.post("/deleteCategory", adminController.delete_category);

//blog routes
router.get("/getBlogs", adminController.get_blogs);
router.get("/getBlog/:id", adminController.get_single_blog);
router.post("/setBlog", adminController.set_single_blog);
router.post("/addBlog", adminController.add_single_blog);

module.exports = router;
