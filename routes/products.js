const {Router} = require("express");

const router = Router();

//route to get all products or 
//products of a category or subcategory
router.get("/",(req,res)=>{
    const response={};
    if(req.query.category ){
        response.category=req.query.category;
    }
    if(req.query.subcategory){
        response.subcategory=req.query.subcategory;
    }
    console.log(response);
    res.render('products');
})

//get single product based on product id
router.get("/:id",(req,res)=>{
    res.json(`product with id ${req.params.id}`);
});

module.exports=router;