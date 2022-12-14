const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
// const {requireAuth} = require("../middleware/authMiddleware");

//login route:-
router.post("/login",adminController.login);

//product routes
//done
router.get("/getProducts", adminController.get_products);
//done
router.get("/getProduct/:id", adminController.get_single_product);
router.put("/changeProductState/:id", adminController.change_product_state);
//done
router.put("/setProduct/:id", adminController.set_single_product);
//inprogress
router.get("/addProduct", adminController.get_add_product);
//inprogress
router.post("/addProduct", adminController.post_add_product);

//user routes
//done
router.get("/getUsers", adminController.get_users);
//done
router.get("/getUser/:id", adminController.get_single_user);
//done
router.post("/setUser", adminController.set_single_user);

//order routes
//done
router.get("/getOrders", adminController.get_orders);
//done
router.get("/getOrder/:id", adminController.get_single_order);

//coupon routes
//done
router.get("/getCoupons", adminController.get_coupons);
//done
router.get("/getCoupon/:id", adminController.get_single_coupon);
//done
router.post("/setCoupon", adminController.set_coupons);
//done
router.post("/addCoupon", adminController.add_coupon);

//blog routes
//done
router.get("/getBlogs", adminController.get_blogs);
//done
router.get("/getBlog/:id", adminController.get_single_blog);
//done
router.post("/setBlog", adminController.set_single_blog);
//done
router.post("/addBlog", adminController.add_single_blog);

module.exports = router;
