const Product = require("../models/product");

module.exports.products_get = async (req,res)=>{
    const productList = await Product.find();
    res.render('products',{productList});
}

module.exports.single_product_get = async (req,res)=>{
    const product = await Product.findById(req.params.id);
    // for(let i=0;i<product.reviews.length;i++){
    //     await product.populate(`reviews[${i}].user_id`);
    // }
    console.log(product);
    res.render('productdetails',{product});
}