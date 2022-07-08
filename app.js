const mongoose = require("mongoose");
const express = require("express");
// const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const User = require("./models/user");
dotenv.config();


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
    console.log("Connected to Database")
    const port = process.env.PORT || 5000;
    app.listen(port);
    console.log(`listening on port ${port}`);
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(productRouter);