const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("contact", { userLoggedIn });
});

module.exports = router;
