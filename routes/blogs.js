const { Router } = require("express");
const blogController = require("../controllers/blogController");

const router = Router();

//route to get all products or
//products of a category or subcategory

//get single product based on product id
router.get("/:id", (req, res) => {
  res.render("blogdetails");
});

router.get("/", blogController.blogs_get);

module.exports = router;
