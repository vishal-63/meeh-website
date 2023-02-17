const { Router } = require("express");

const router = Router();
const productController = require("../controllers/productController");

require("../models/user");

router.get("/search", productController.products_get_search);

router.get("/:id", productController.single_product_get);

router.post("/", productController.products_get_next);

router.get("/", productController.products_get);

module.exports = router;
