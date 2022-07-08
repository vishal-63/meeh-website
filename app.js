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

// Models
const User = require("./models/user");

const app = express();

// Ejs view engine
app.set("view engine", "ejs");

//declaring public directory to get assets from
app.use(express.static(__dirname + "/public"));

// Login route
app.use("/login", loginRouter);
app.use("/cart", cartRouter);
app.use("/products", productRouter);
app.use("/wishlist", wishlistRouter);
app.use("/register", registerRouter);

//about us route
app.get("/about",(req,res)=>{
  res.render('about');
})


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
