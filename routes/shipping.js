const { Router } = require("express");
const { requireAuth } = require("../middleware/authMiddleware");

const shippingController = require("../controllers/shippingController");

const router = Router();

router.get("/assign-awb", (req, res) => res.send("hello"));

module.exports = router;
