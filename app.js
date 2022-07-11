'use strict';
// Packages
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require('fs');
const join = require('path').join;
const models = join(__dirname, 'models');
dotenv.config();

//require models
require("./models/product");

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*\.js$/))
  .forEach(file => require(join(models, file)));

// Models
const User = require("./models/user");
const Product = require("./models/product");
const User = require("./models/user");
// const Wishlist = require("./models/wishlist");
const Test = require("./models/test1");
const Blog = require("./models/blog");
const Coupon = require("./models/coupon");
const Order = require("./models/order");
// const Cart = require("./models/cart");


// Routes
const loginRouter = require("./routes/login");
const cartRouter = require("./routes/cart");
const productRouter = require("./routes/products");
const wishlistRouter = require("./routes/wishlist");
const registerRouter = require("./routes/register");
const profileRouter = require("./routes/profile");
const contactRouter = require("./routes/contact");
const checkoutRouter = require("./routes/checkout");
const blogRouter = require("./routes/blogs");


const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
//declaring public directory to get assets from
app.use(express.static(__dirname + "/public"));

// Database connection
mongoose
  .connect(process.env.MONGODBURI)
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port);
    console.log(`listening on port ${port}`);
  })
  .catch((err) => {
    console.log(err.message);
  });

// Ejs view engine
app.set("view engine", "ejs");

// Base route
app.get("/", (req, res) => {
  res.render("index");
});

//setting routes for each path
app.use("/login", loginRouter);
app.use("/cart", cartRouter);
app.use("/products", productRouter);
app.use("/profile", profileRouter);
app.use("/contact", contactRouter);
app.use("/checkout", checkoutRouter);
app.use("/wishlist", wishlistRouter);
app.use("/register", registerRouter);
app.use("/blogs", blogRouter);

//about us route
app.get("/about", (req, res) => {
  res.render("about");
});

app.get('/updateUser',async (req,res)=>{
  
  try{
    const id="62c9b688592b0b4307609127";
    const userCheck = await User.findById(id);
    await userCheck.populate({
      path: 'wishlist',
      model: Product,
    });
    console.log(userCheck);
  
    res.json("hello");
  }
  catch(err){
    console.log(err);
  }
  
});

// 404 page
app.get("*", (req, res) => {
  res.render("not-found");
});

// async function addProducts(){
//   const userData = await User.findById("62c810f418e0554c9d174bf5");
//   const productData0 = await Product.findById("62c876ddd9c721e9b84472e1");
//   const productData1 = await Product.findById("62c8763f78b5e02a4a99f1dc");
//   const productData2 = await Product.findById("62c87554d1e70669ca1b4499");
//   // console.log(userData._id);
//   const wishlistData={
//     user_id:userData._id,
//     products:[productData1._id,productData2]
//   }

//   const wishlist = new Wishlist(wishlistData);
//   wishlist.save((err,result)=>{
//     if(err){
//       console.log(err.message);
//     }
//     else{
//       console.log(result);
//     }
//   })

// const product1 = await Product.findById("62c819e5d42faf96057817fa");
// product1.reviews[0].user_id ="62c81015651761a1db0feeeb";
// console.log(mongoose.Types.ObjectId("62c81015651761a1db0feeeb"));
// product1.save((err,result)=>{
//   if(err){
//     console.log(err.message);
//   }
//   else{
//     console.log(result);
//   }
// });
// console.log(product1.reviews[0]);
// }
// addProducts();
// addUsers();

// async function test(){
//   const wishlist = await Wishlist.findOne();
//   await wishlist.populate('user_id');
//   console.log(wishlist);
// }
// test()

// user ids
// 62c8106e13a9e64fac4dcffe
// 62c81015651761a1db0feeeb
// 62c810dcfd35fb6554585b2b

// product ids
// 62c87554d1e70669ca1b4499
// 62c875ab28503cb136482c0c
// 62c875eba93d01aa26e5a4b8
// 62c8763f78b5e02a4a99f1dc

