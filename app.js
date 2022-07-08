// Packages
const mongoose = require("mongoose");
const express = require("express");
// const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

// Routes
const loginRouter = require("./routes/login");
const cartRouter = require("./routes/cart");
const productRouter = require("./routes/productsRoutes");

// Models
const User = require("./models/user");

// Ejs view engine
app.set("view engine", "ejs");

// Login route
app.use("/login", loginRouter);
app.use("/cart", cartRouter);
app.use("/products", productRouter);

//declaring public directory to get assets from
app.use(express.static(__dirname + "/public"));

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
