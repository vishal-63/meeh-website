const { Router } = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const wishlistController = require("../controllers/wishlistController");

const router = Router();

router.get("/", requireAuth, wishlistController.wishlist_get);

router.post(
  "/deleteWishlist",
  requireAuth,
  wishlistController.delete_wishlist_post
);

router.post("/addWishlist", requireAuth, wishlistController.add_wishlist_post);

module.exports = router;
