// Packages
const mongoose = require("mongoose");
const express = require("express");
// const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

// Routes
const loginRouter = require("./routes/login");
const cartRouter = require("./routes/cart");
const productRouter = require("./routes/products");
const wishlistRouter = require("./routes/wishlist");
const registerRouter = require("./routes/register");
const profileRouter = require("./routes/profile");
const contactRouter = require("./routes/contact");
const checkoutRouter = require("./routes/checkout");

// Models
const User = require("./models/user");
const Blog = require("./models/blog");
const Coupon = require("./models/coupon");
const Product = require("./models/product");
const Order = require("./models/order");
const Cart = require("./models/cart");

const app = express();

// Ejs view engine
app.set("view engine", "ejs");

//declaring public directory to get assets from
app.use(express.static(__dirname + "/public"));

// Base route
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/login", loginRouter);
app.use("/cart", cartRouter);
app.use("/products", productRouter);
app.use("/profile", profileRouter);
app.use("/contact", contactRouter);
app.use("/checkout", checkoutRouter);
app.use("/wishlist", wishlistRouter);
app.use("/register", registerRouter);

//about us route
app.get("/about", (req, res) => {
  res.render("about");
});

// 404 page
app.get("*", (req, res) => {
  res.render("not-found");
});

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

// user ids
// 62c8106e13a9e64fac4dcffe
// 62c81015651761a1db0feeeb
// 62c810dcfd35fb6554585b2b

// product ids
// 62c87554d1e70669ca1b4499
// 62c875ab28503cb136482c0c
// 62c875eba93d01aa26e5a4b8
// 62c8763f78b5e02a4a99f1dc
