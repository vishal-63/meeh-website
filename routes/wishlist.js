const {Router} = require("express");
const {requireAuth} = require("../middleware/authMiddleware");

const router = Router();

router.get("/",requireAuth,(req,res)=>{
    res.render('wishlist');
});

module.exports = router;