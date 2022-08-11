// const express = require("express");
// const router = express.Router();

// const multer = require('multer');
// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })

// // const upload = require("../middleware/uploadMiddleware");
// const Product = require("../models/product");

// const  ImageKit = require("imagekit");
// // const cloudinary = require('cloudinary').v2;

// const imagekit = new ImageKit({
//     publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
//     privateKey : process.env.IMAGE_KIT_SECRET_KEY,
//     urlEndpoint : process.env.IMAGE_KIT_ENDPOINT
// });

// router.get("/",(req,res)=>{
//     res.render("images");
// });

// router.post("/",upload.single("photo"),async (req,res)=>{

//     try{
//         // console.log(req.file);
//         // res.send(req.file);

//         console.log(req.file);
//         imagekit.upload({
//             file:req.file.buffer,
//             fileName:req.file.originalname,

//         },async (err,result)=>{
//             if(err){
//                 console.log(err);
//                 res.send(err.message);
//             }
//             else{
//                 const product = await Product.findOne({product_name:"Pen"});
//                 product.inventory[0].thumbnail_images.push(result.url);
//                 // product.inventory[0].large_images.push(result.url);

//                 product.save((err,product)=>{
//                     if(err){
//                         throw new Error("Could not save image link!")
//                     }
//                     else{
//                         res.render("showImage",{
//                             imageUrl:product.inventory[0].thumbnail_images.at(-1)
//                             // imageUrl:product.inventory[0].large_images.at(-1)
//                         });
//                     }
//                 })
//             }
//         });

//         // res.send(result.url);
//         // const product = await Product.findOne({product_name:"Pen"});

//         // product.inventory[0].thumbnail_images.push(result.url);

//         // product.save((err,result)=>{
//         //     if(err){
//         //         throw new Error("unable to save image into product stock!")
//         //     }
//         //     else{
//         //         console.log(result)
//         //         console.log(result.inventory);
//         //         res.send(result);
//         //     }
//         // })
//         // res.render("showImage",{imageUrl:result.url});
//     }
//     catch(err){
//         console.log(err);
//         res.send(err.message);
//     }
// })

// router.get("/want", async (req,res)=>{
//     const options={
//         colors:true,
//     }
//     try{

//         const product = await Product.findOne({product_name:"Pen"});
//         const url = product.inventory[0].images[0];
//         console.log(product);
//         res.render("showImage",{imageUrl:url});

//     }catch(err){
//         console.log(err);
//         res.status(400).send(err.message);
//     }
// })

// // cloudinary.config({
// //     cloud_name: 'image-testing',
// //     api_key: process.env.CLOUDINARY_API_KEY,
// //     api_secret: process.env.CLOUDINARY_API_SECRET,
// //     secure: true
// // });
// // router.get("/",(req,res)=>{
// //     res.render("images");
// // });

// // router.post("/",upload.single("photo"),async (req,res)=>{
// //     console.log(req.file.path);

// //     try{
// //         const result = await cloudinary.uploader.upload(req.file.path);
// //         const product = await Product.findOne({product_name:"Pen"});

// //         product.inventory[1].images.push(result.url);
// //         product.save((err,result)=>{
// //             if(err){
// //                 throw new Error("unable to save image into product stock!")
// //             }
// //             else{
// //                 console.log(result)
// //                 console.log(result.inventory);
// //                 res.send(result);
// //             }
// //         })
// //     }
// //     catch(err){
// //         console.log(err);
// //         res.send(err.message);
// //     }
// // })

// // router.get("/want", async (req,res)=>{
// //     const options={
// //         colors:true,
// //     }
// //     try{

// //         const product = await Product.findOne({product_name:"Pen"});
// //         const url = product.inventory[0].images[0];
// //         console.log(product);
// //         res.render("showImage",{imageUrl:url});

// //     }catch(err){
// //         console.log(err);
// //         res.status(400).send(err.message);
// //     }
// // })

// module.exports = router;
