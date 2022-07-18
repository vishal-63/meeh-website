const User = require("../models/user");
const Product = require("../models/product");

module.exports.checkout_get = async(req,res)=>{
    const user = User.findById({_id:res.user.id});
    res.render("checkout",{address:res.user.adresses,cart:user.cart});
}

module.exports.checkout_post = async(req,res)=>{
    const {address_id} = req.address_id;
    res.send("hello");
}