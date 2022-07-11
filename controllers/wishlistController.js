const User = require("../models/user");
const Product = require('../models/product');

module.exports.wishlist_get =async (req,res)=>{
    const user = await User.findById(res.user.id);
    await user.populate({
        path:'wishlist',
        model:Product,
    });
    const wishlist = user.wishlist;
    console.log(wishlist);
    res.render('wishlist',{wishlist:wishlist});
}

module.exports.update_wishlist_post = (req,res)=>{
    console.log(0);
    console.log(req.body);
}