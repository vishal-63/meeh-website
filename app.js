"use strict";
// Packages
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const join = require("path").join;
const models = join(__dirname, "models");
dotenv.config();

//require models
require("./models/product");

fs.readdirSync(models)
  .filter((file) => ~file.search(/^[^.].*\.js$/))
  .forEach((file) => require(join(models, file)));

// Models
const Product = require("./models/product");
const User = require("./models/user");
// const Wishlist = require("./models/wishlist");
const Test = require("./models/test1");
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
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }
  res.render("index", { userLoggedIn });
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

//about us route
app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.render("index", { userLoggedIn: false });
});