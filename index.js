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
const policyRouter = require("./routes/policyRoutes");
const googleAuthRouter = require("./routes/googleAuth");
const imageRouter = require("./routes/imageUpload");
const productUploadRouter = require("./routes/uploadProducts");
const shippingRouter = require("./routes/shipping");
const orderRouter = require("./routes/order.js");
const adminRouter = require("./routes/adminRoutes.js");

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
    console.log(err, err.message);
  });

// Ejs view engine
app.set("view engine", "ejs");

// maintenance route
// app.get("*", (req, res) => {
//   res.render("maintenance");
// });

// Base route
app.get("/", async (req, res) => {
  let userLoggedIn = false;
  let cartLength;

  if (req.cookies.jwt) {
    userLoggedIn = true;
    cartLength = await cartController.get_cart_length(req.cookies.jwt);
  } else if (req.cookies.cart) {
    cartLength = JSON.parse(req.cookies.cart).length;
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
app.use("/auth/google", googleAuthRouter);
app.use("/shipping", shippingRouter);
app.use("/policy", policyRouter);

//temp for uploading images to database;
app.use("/orders", orderRouter);

//admin routes
app.use("/admin", adminRouter);

//about us route
app.get("/about", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

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
app.get("*", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("not-found", { userLoggedIn, cartLength });
});
