const {Router} = require("express");
const {requireAuth} = require("../middleware/authMiddleware");
const wishlistController = require('../controllers/wishlistController');

const router = Router();

router.get("/",requireAuth,requireAuth,wishlistController.wishlist_get);

router.get("/updateWishlist",requireAuth,wishlistController.wishlist_get);

module.exports = router;