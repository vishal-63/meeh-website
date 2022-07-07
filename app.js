const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const User = require("./models/user");
dotenv.config();

const app = express();

app.use(bodyParser);

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
