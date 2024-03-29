// Packages
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

//require models
require("./models/product");

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
const shippingRouter = require("./routes/shipping");
const orderRouter = require("./routes/order.js");
const adminRouter = require("./routes/adminRoutes.js");

const cartController = require("./controllers/cartController");
const categoryController = require("./controllers/categoryController");
const Product = require("./models/product");

//temp use only for image upload
const productUploadRouter = require("./routes/uploadProducts");

const app = express();

corsOptions = {
  origin: [
    "http://127.0.0.1:5173",
    "https://meehh-admin.netlify.app",
    "meehh-admin.netlify.app",
  ],
};

// allowing crossorigin request
app.use(cors(corsOptions));

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

  const categories = await categoryController.getCategories();

  if (req.cookies.jwt) {
    userLoggedIn = true;
    cartLength = await cartController.get_cart_length(req.cookies.jwt);
  } else if (req.cookies.cart) {
    cartLength = JSON.parse(req.cookies.cart).length;
  }

  res.render("index", { userLoggedIn, categories, cartLength });
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

//temp for uploading images links to database;
app.use("/imageUpload", productUploadRouter);

app.use("/orders", orderRouter);

//admin routes
app.use("/admin", adminRouter);

//about us route
app.get("/about", async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  const categories = await categoryController.getCategories();

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("about", { userLoggedIn, categories, cartLength });
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
  const categories = await categoryController.getCategories();
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("not-found", { userLoggedIn, categories, cartLength });
});
