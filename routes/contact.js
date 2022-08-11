const express = require("express");
const router = express.Router();
const contactusController = require("../controllers/contactusController");

router.get("/", (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("contact", { userLoggedIn });
});

router.post("/",contactusController.send_mail);

module.exports = router;
