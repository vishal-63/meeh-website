// Packages
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
// var livereload = require("livereload");
// var connectLiveReload = require("connect-livereload");
dotenv.config();

//require models
require("./models/product");

// Models
const Product = require("./models/product");
const User = require("./models/user");
// const Wishlist = require("./models/wishlist");
// const Test = require("./models/test1");
const Blog = require("./models/blog");
const Coupon = require("./models/coupon");
const Order = require("./models/order");

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
const googleAuthRouter = require("./routes/googleAuth");
const imageRouter = require("./routes/imageUpload");
const productUploadRouter = require("./routes/uploadProducts");
const shippingRouter = require("./routes/shipping");

const cartController = require("./controllers/cartController");

const app = express();

// live reload browser on change in any files
// const liveReloadServer = livereload.createServer();
// liveReloadServer.server.once("connection", () => {
//   setTimeout(() => {
//     liveReloadServer.refresh("/");
//   }, 100);
// });

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(connectLiveReload());
//declaring public directory to get assets from
app.use(express.static(__dirname + "/public"));

// Database connection
mongoose
  .connect(process.env.MONGODBURI)
  .then(() => {
    const port = process.env.PORT || 5000;
    const host = process.env.HOST || "0.0.0.0";
    app.listen(port);
    console.log(`listening on port ${port}`);
  })
  .catch((err) => {
    console.log("Error while connecting to mongoose");
    console.log(err);
  });

// Ejs view engine
app.set("view engine", "ejs");

// Base route
app.get("/", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("index", { userLoggedIn, cartLength });
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
app.use("/auth/google", googleAuthRouter);
app.use("/images", imageRouter);
app.use("/shipping", shippingRouter);
//temp for uploading images to database;
app.use("/editProducts", productUploadRouter);

//about us route
app.get("/about", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = cartController.get_cart_length(req.cookies.jwt);

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("about", { userLoggedIn, cartLength });
});

// logout route
app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect(req.header("Referer") || "/");
});

// 404 page
app.get("*", (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("not-found", { userLoggedIn });
});

// app.get("/productUpdate",async (req,res)=>{

//   const product= await Product.findOne({product_name:"Eraser"});
//   product.color=["f6f6f6","333333"];
//   product.size=["S","M","L"];
//   product.stock={};
//   for(let s=0;s<product.size.length;s++){
//     for(let c=0;c<product.color.length;c++){
//       product.stock[ product.size[s] + "_" + product.color[c] ]=20;
//     }
//   }

//   product.save((err,result)=>{
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log(result);
//     }
//   })
//   res.json(product);
// })

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

async function printUsers() {
  // await User.deleteOne({ first_name: "Nikharv" });
  // await User.deleteOne({ first_name: "Shubham" });
  // await User.deleteOne({ first_name: "Shyam" });
  // console.log(await User.find());
}

// printUsers();
