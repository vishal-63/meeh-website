
const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const Blog = require("../models/blog");
const ImageKit = require("imagekit");
const fs = require("fs");

//helper
const notFound = async (req,res)=>{
    
    let userLoggedIn = false;
    if (req.cookies.jwt) {
      userLoggedIn = true;
    }
  
    res.render("not-found", { userLoggedIn });
}

//image kit helper

const uploadToImageKit1 = async (largeImgBuffer, fileName) => {
  const imageKit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_SECRET_KEY,
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  });

  try {
    const result = await imageKit.upload({
      file: largeImgBuffer,
      fileName: fileName,
    });
    return result;
  } catch (error) {
    console.log(error.message, error);
    return null;
  }
};

const handleImageUpload = async (folderPath,fileName)=>{
    const links=[]
    const images = await fs.promises.readdir(folderPath);
    
    for(let i=0;i<images.length;i++){
        const imageBuffer = await fs.promises.readFile(folderPath+"/"+images[i]);
        const result = await uploadToImageKit1(imageBuffer,fileName);
        if(result!=null){
            links.append(result);
        }
    }
    return links
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
        console.log(product);
        res.render("singleProductAdmin",{product,isAdmin:true});
    }catch(err){
        notFound(req,res);
    }
}

module.exports.set_single_product = async (req,res)=>{
    const updated = req.body;
    const product = await Product.findById(req.body._id);
    console.log(product);
    console.log(req.body);
    if(product){
        product.product_name = updated.product_name;
        product.description = updated.description;
        product.price = updated.price;
        product.category = updated.category;
        product.sub_category = updated.sub_category;
        product.is_deleted = updated.is_deleted;
        await product.save();
    }
    const ans = await Product.findById(req.body._id);
    res.send(ans);
}

//in progress
module.exports.get_add_product = async (req,res)=>{
    res.send("show page for adding a product");
}

module.exports.post_add_product = async (req,res)=>{
    const data = req.body;
    //call imagekit and get links to images of thumbnail and larges images
    const thumbnail_images_links = await handleImageUpload(data.thumbnail_images_path,data.product_name+new Date());
    const large_images_links = await handleImageUpload(data.large_images_path,data.product_name+new Date());
    //above work is in progress
    
    const product = new Product({
        product_name:data.product_name,
        description:data.description,
        size:data.size,
        color:data.color,
        price:data.price,
        inventory:{
            color_id:'',
            stock:0,
            thumbnail_images:thumbnail_images_links,
            large_images:large_images_links,
        },
        category:data.category,
        sub_category:data.sub_category,
        discount:data.discount,
        reviews:[],
        is_deleted:data.is_deleted
    });
    await product.save();
    res.send("New Product create!");
}

//users
module.exports.get_users = async (req,res)=>{
    const users = await User.find();

    for(let i=0;i<users.length;i++){
        await users[i].populate({
            path:"cart.product_id",
            model:Product,
        });
    }
    // res.send(users);
    res.render("usersAdmin",{users});
}

module.exports.get_single_user = async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        await user.populate({
            path:"cart.product_id",
            model:Product,
        });
        console.log(user);  
        res.render("singleUserAdmin",{user,isAdmin:true});
    }catch(err){
        notFound(req,res);
    }
}

module.exports.set_single_user = async(req,res)=>{
    const updated = req.body;
    const user = await User.findById(req.body._id);
    user.first_name = updated.first_name;
    user.last_name = updated.last_name;
    user.email = updated.email;
    user.phone_no = updated.phone_no;
    user.is_deleted = updated.is_deleted;
    await user.save();
    res.send(await User.findById(req.body._id));
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
    // console.log(orders[0].products[1].product_id.inventory.thumbnail_images[0]);
    // res.send(orders);
    res.render("ordersAdmin",{orders,userLoggedIn,cartLength:0});
}

module.exports.get_single_order = async(req,res)=>{
    try{
        const order = await Order.findById(req.params.id);
        await order.populate({
            path:"products.product_id",
            model:Product,
        });
        await order.populate({
            path:"user_id",
            model:User,
        });
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
        console.log(coupon);
        res.send(coupon);
    }catch(err){
        notFound(req,res);
    }
}

module.exports.set_coupons = async (req,res)=>{
    const coupon =await Coupon.findById(req.body.id);
    const updated = req.body;
    coupon.coupon_code = updated.coupon_code;
    coupon.amount = updated.amount;
    coupon.is_deleted = updated.is_deleted;
    await coupon.save();
    res.send(await Coupon.findById(req.body.id));
}

module.exports.add_coupon = async(req,res)=>{
    const coupon = new Coupon({
        coupon_code:req.coupon_code,
        amount:req.amount,
        is_deleted:req.is_deleted
    });
    await coupon.save();
    res.send("Created New Coupon!");
}

//blogs
module.exports.get_blogs = async (req,res)=>{
    const blogs = await Blog.find();
    res.send(blogs);
}

module.exports.get_single_blog = async (req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id);
        console.log(blog);
        res.send(blog);
    }
    catch(err){
        notFound(req,res);
    }
}

module.exports.set_single_blog = async (req,res)=>{
    const blog = await Blog.findById(req.body.id);
    const updated = req.body;
    blog.title = updated.title;
    blog.content = updated.content;
    blog.tags = updated.tags;
    blog.is_deleted = updated.is_deleted;
    await blog.save();
    res.send(await Blog.findById(req.body.id));
}

module.exports.add_single_blog = async (req,res)=>{
    const blog = new Blog({
        title:req.body.title,
        content:req.body.content,
        tags:req.body.tags,
        is_deleted:req.body.is_deleted,
    })
    await blog.save();
    res.send("Created a new Blog!");
}