// Packages
const mongoose = require("mongoose");
const express = require("express");
// const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

// Routes
const loginRouter = require("./routes/login");
const cartRouter = require("./routes/cart");

// Models
const User = require("./models/user");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

app.set("view engine", "ejs");

// Login route
app.use("/login", loginRouter);
app.use("/cart", cartRouter);

//imports from server folders
const productRouter = require("./routes/productsRoutes");

const app = express();

//declaring public directory to get assets from
app.use(express.static(__dirname + '/public'));

//view engine
app.set('view engine', 'ejs');
// app.use(bodyParser);

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

app.use(productRouter);