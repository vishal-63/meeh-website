const { Router } = require("express");

const router = Router();
const productController = require("../controllers/productController");

require("../models/user");
// const Wishlist = require("../models/wishlist");
// const Test1 = require("../models/test1");
// const Test = require("../models/test");

// route to get all products or
// products of a category or subcategory

// get single product based on product id

// router.get("/category/:cat",productController.products_get_by_category);

// router.get("/category",productController.products_get_categories);

router.get("/:id", productController.single_product_get);

router.post("/", productController.products_get_next);

router.get("/", productController.products_get);

// router.get("/",(req,res)=>{
//     const response={};
//     if(req.query.category ){
//         response.category=req.query.category;
//     }
//     if(req.query.subcategory){
//         response.subcategory=req.query.subcategory;
//     }
//     console.log(response);
//     res.render('products');
// })

// router.get("/test",async (req,res)=>{

//     const test = await Test.findOne();
//     await test.populate('test1_id');
//     console.log(test);

//     // const wishlist = await Wishlist.findOne();
//     // await wishlist.populate('user_id');
//     // console.log(wishlist);

//     res.json("hii");
// });

module.exports = router;
