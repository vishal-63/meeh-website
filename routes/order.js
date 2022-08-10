const {Router} = require('express');
const orderController = require("../controllers/orderController");
const { requireAuth } = require("../middleware/authMiddleware");
const router = Router();

router.get("/",requireAuth,orderController.get_user_orders);

module.exports = router;    