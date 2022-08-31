
const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const Blog = require("../models/blog");

//helper
const notFound = async (req,res)=>{
    
    let userLoggedIn = false;
    if (req.cookies.jwt) {
      userLoggedIn = true;
    }
  
    res.render("not-found", { userLoggedIn });
}

//products
module.exports.get_products = async (req,res)=>{
    let userLoggedIn = false;
    if (req.cookies.jwt) {
      userLoggedIn = true;
    }
    const products = await Product.find();
    res.render("productsAdmin",{productList : products,isAdmin:true,userLoggedIn,cartLength:0});
}

module.exports.get_single_product = async (req,res)=>{
    
    try{
        const product = await Product.findById(req.params.id);
        res.send(product);
    }catch(err){
        notFound(req,res);
    }
}


//users
module.exports.get_users = async (req,res)=>{
    const users = await User.find();
    res.send(users);
}

module.exports.get_single_user = async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        res.send(user);
    }catch(err){
        notFound(req,res);
    }
}


//orders
module.exports.get_orders = async (req,res)=>{
    let userLoggedIn = false;
    if (req.cookies.jwt) {
      userLoggedIn = true;
    }

    const orders = await Order.find();
    for(let i=0;i<orders.length;i++){
        await orders[i].populate({
            path:"products.product_id",
            model:Product,
        });
        await orders[i].populate({
            path:"user_id",
            model:User,
        });
    }
    console.log(orders[0].products);
    // res.send(orders);
    res.render("ordersAdmin",{orders,userLoggedIn,cartLength:0});
}

module.exports.get_single_order = async(req,res)=>{
    try{
        const order = await Order.findById(req.params.id);
        res.send(order);
    }
    catch(err){
        notFound(req,res);
    }
}

//coupons
module.exports.get_coupons = async (req,res)=>{
    const coupons = await Coupon.find();
    res.send(coupons)
}

module.exports.get_single_coupon = async (req,res)=>{
    try{
        const coupon = await Coupon.findById(req.params.id);
        res.send(coupon);
    }catch(err){
        notFound(req,res);
    }
}

//blogs
module.exports.get_blogs = async (req,res)=>{
    const blogs = await Blog.find();
    res.send(blogs);
}

module.exports.get_single_blog = async (req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id);
        res.send(blog);
    }
    catch(err){
        notFound(req,res);
    }
}