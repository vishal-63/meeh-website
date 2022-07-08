const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log(req.body, req.body.email, req.body.password);
});

router.get("/", (req, res) => {
  res.render("login");
});

module.exports = router;
