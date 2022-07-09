const {Router} = require("express");

const router = Router();

//route to get all products or 
//products of a category or subcategory

//get single product based on product id
router.get("/:id",(req,res)=>{
    console.log(`product with id ${req.params.id}`);
    res.render('blogdetails');
});

router.get("/",(req,res)=>{
    const response={};
    if(req.query.category ){
        response.category=req.query.category;
    }
    if(req.query.subcategory){
        response.subcategory=req.query.subcategory;
    }
    console.log(response);
    res.render('blogs');
})


module.exports=router;