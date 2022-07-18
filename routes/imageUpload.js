const express = require("express");
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const upload = require("../middleware/uploadMiddleware");
const Product = require("../models/product");

cloudinary.config({ 
    cloud_name: 'image-testing', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

router.get("/",(req,res)=>{
    res.render("images")
});

router.post("/",upload.single("photo"),async (req,res)=>{
    console.log(req.file.path);
    
    try{
        const result = await cloudinary.uploader.upload(req.file.path);
        const product = await Product.findOne({product_name:"Pen"});

        product.inventory[1].images.push(result.url);
        product.save((err,result)=>{
            if(err){
                throw new Error("unable to save image into product stock!")
            }
            else{
                console.log(result)
                console.log(result.inventory);
                res.send(result);
            }
        })
    }
    catch(err){
        console.log(err);
        res.send(err.message);
    }
})

router.get("/want", async (req,res)=>{
    const options={
        colors:true,
    }
    try{

        const product = await Product.findOne({product_name:"Pen"});
        const url = product.inventory[0].images[0];
        console.log(product);
        res.render("showImage",{imageUrl:url});

    }catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }
})

module.exports = router;