const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const Blog = require("../models/blog");
const ImageKit = require("imagekit");
const jwt = require("jsonwebtoken");
const fs = require("fs");

//helper
const notFound = async (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("not-found", { userLoggedIn });
};

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

const handleImageUpload = async (folderPath, fileName) => {
  const links = [];
  const images = await fs.promises.readdir(folderPath);

  for (let i = 0; i < images.length; i++) {
    const imageBuffer = await fs.promises.readFile(
      folderPath + "/" + images[i]
    );
    const result = await uploadToImageKit1(imageBuffer, fileName);
    if (result != null) {
      links.append(result);
    }
  }
  return links;
};


//jwt helper
const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

const isAdmin = (req)=>{
  //getting jwt from user req
  const token = req.body.jwt;

  if(token){
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decodedToken)=>{
      if(err){
        console.log(err.message);
        false;
      }
      else{
        const user = decodedToken.id;
        if(!user.is_admin){
          console.log(err.message);
          return false;
        }
        else{
          return true;
        }
      }
    })
  }
  return false;
}

//authentication

module.exports.login = async (req,res)=>{
  const { email, password } = req.body;
  console.log(email,password);
  try {
    const user = await User.login(email, password);
    
    if(!user.is_admin){
      console.log("controller", err);
      res.status(400).json({ error: err.message });
      return;
    }
    const jwtToken = createJWT(user._id);

    const data = {
      user_info:[user._id,
        user.first_name,
        user.last_name,],
      jwt:jwtToken,
    }

    // res.cookie("jwt", jwtToken, { httpOnly: true });
    // res.status(200).json({ message: "Login successful!" });

    //sending data of admin with jwt token;
    res.json({data:data,"redirect":"To dashboard"});

  } catch (err) {
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
}

//products
module.exports.get_products = async (req, res) => {
  if( ! isAdmin(req.body.jwt)){
    res.send("An error occurred. Please try again later!");
    return;
  }
  const category = req.query.category;
  let products;
  if (category) {
    products = await Product.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  } else products = await Product.find();

  res.json(products);
};

module.exports.change_product_state = async (req, res) => {
  if( ! isAdmin(req.body.jwt)){
    res.send("An error occurred. Please try again later!");
    return;
  }
  try {
    const product = await Product.findById(req.params.id);
    product.is_deleted = !product.is_deleted;
    await product.save();
    res.send(product.is_deleted ? "Product deactivated" : "Product Activated");
  } catch (err) {
    console.log(err, err.message);
    res.send("An error occurred. Please try again later!");
  }
};

module.exports.get_single_product = async (req, res) => {
  if( ! isAdmin(req.body.jwt)){
    res.send("An error occurred. Please try again later!");
    return;
  }
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    console.log(err);
    res.json({ error: err.message });
    // notFound(req, res);
  }
};


module.exports.set_single_product = async (req, res) => {
  try{
    if( ! isAdmin(req.body.jwt)){
      res.send("An error occurred. Please try again later!");
      return;
    }
    const updated = req.body;
    const product = await Product.findById(req.params.id);
    console.log(req.body);
    if (product) {
      product.product_name = updated.product_name;
      product.description = updated.description;
      product.price = updated.price;
      product.discount = updated.discount;
      product.category = updated.category;
      product.sub_category = updated.sub_category || updated.category;
      product.is_deleted = updated.is_deleted;
      product.inventory.thumbnail_images = updated.thumbnail_images;
      product.inventory.large_images = updated.large_images;
      product.save(function (err, result) {
        if (err) {
          res.status(500).json({
            error: err.message,
            message:
              "An error has occurred while saving the product. Please try again later!",
          });
        } else {
          console.log("Product updated");
          console.log(result);
          res.status(201).json({ message: "Product updated successfully!" });
        }
      });
    } else {
      res.status(404).json({ message: "Product not found!" });
    }
  }
  catch(err){
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
};

//in progress
module.exports.get_add_product = async (req, res) => {
  if( ! isAdmin(req.body.jwt)){
    res.send("An error occurred. Please try again later!");
    return;
  }
  res.send("show page for adding a product");
};

module.exports.post_add_product = async (req, res) => {
  if( ! isAdmin(req.body.jwt)){
    res.send("An error occurred. Please try again later!");
    return;
  }
  const data = req.body;
  console.log(data);
  //call imagekit and get links to images of thumbnail and larges images
  // const thumbnail_images_links = await handleImageUpload(
  //   data.thumbnail_images_path,
  //   data.product_name + new Date()
  // );
  // const large_images_links = await handleImageUpload(
  //   data.large_images_path,
  //   data.product_name + new Date()
  // );
  //above work is in progress

  const product = new Product({
    product_name: data.product_name,
    description: data.description,
    size: data.size || [],
    color: data.color || [],
    price: data.price,
    inventory: {
      color_id: "",
      stock: data.stock || 0,
      // thumbnail_images: thumbnail_images_links,
      // large_images: large_images_links,
    },
    category: data.category,
    sub_category: data.sub_category || data.category,
    discount: data.discount,
    reviews: [],
    is_deleted: false,
  });
  product.save(function (err, result) {
    if (err) {
      res.status(500).json({
        error: err.message,
        message:
          "An error has occurred while saving the product. Please try again later!",
      });
    } else {
      console.log("Product added");
      console.log(result);
      res.status(201).json({ message: "Product added successfully!" });
    }
  });
};

//users
module.exports.get_users = async (req, res) => {
  const users = await User.find();
  console.log("users requested");
  res.json(users);
  // res.render("usersAdmin",{users});
};

module.exports.get_single_user = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    await user.populate({
      path: "cart.product_id",
      model: Product,
    });
    console.log(user);
    res.render("singleUserAdmin", { user, isAdmin: true });
  } catch (err) {
    notFound(req, res);
  }
};

module.exports.set_single_user = async (req, res) => {
  const updated = req.body;
  const user = await User.findById(req.body._id);
  user.first_name = updated.first_name;
  user.last_name = updated.last_name;
  user.email = updated.email;
  user.phone_no = updated.phone_no;
  user.is_deleted = updated.is_deleted;
  await user.save();
  res.json(await User.findById(req.body._id));
};

//orders
module.exports.get_orders = async (req, res) => {
  const orders = await Order.find({ payment_status: "Successful" });
  for (let i = 0; i < orders.length; i++) {
    await orders[i].populate({
      path: "products.product_id",
      model: Product,
    });
    await orders[i].populate({
      path: "user_id",
      model: User,
    });
    const totalQuantity = orders[i].products.reduce(
      (total, product) => total + product.quantity,
      0
    );
    orders[i].total_quantity = totalQuantity;
  }

  // console.log(orders[0].products[1].product_id.inventory.thumbnail_images[0]);
  // res.send(orders);
  res.json(orders);
};

module.exports.get_single_order = async (req, res) => {
  console.log(req.params.id);
  try {
    const order = await Order.findById(req.params.id);
    await order.populate({
      path: "products.product_id",
      model: Product,
    });
    await order.populate({
      path: "user_id",
      model: User,
    });
    res.json(order);
  } catch (err) {
    console.log(err, err.message);
    res.status(404).json({ message: "Order not found", error: err.message });
  }
};

//coupons
module.exports.get_coupons = async (req, res) => {
  const coupons = await Coupon.find();
  res.send(coupons);
};

module.exports.get_single_coupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    console.log(coupon);
    res.send(coupon);
  } catch (err) {
    notFound(req, res);
  }
};

module.exports.set_coupons = async (req, res) => {
  const coupon = await Coupon.findById(req.body.id);
  const updated = req.body;
  coupon.coupon_code = updated.coupon_code;
  coupon.amount = updated.amount;
  coupon.is_deleted = updated.is_deleted;
  await coupon.save();
  res.send(await Coupon.findById(req.body.id));
};

module.exports.add_coupon = async (req, res) => {
  const coupon = new Coupon({
    coupon_code: req.coupon_code,
    amount: req.amount,
    is_deleted: req.is_deleted,
  });
  await coupon.save();
  res.send("Created New Coupon!");
};

//blogs
module.exports.get_blogs = async (req, res) => {
  const blogs = await Blog.find();
  res.send(blogs);
};

module.exports.get_single_blog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    console.log(blog);
    res.send(blog);
  } catch (err) {
    notFound(req, res);
  }
};

module.exports.set_single_blog = async (req, res) => {
  const blog = await Blog.findById(req.body.id);
  const updated = req.body;
  blog.title = updated.title;
  blog.content = updated.content;
  blog.tags = updated.tags;
  blog.is_deleted = updated.is_deleted;
  await blog.save();
  res.send(await Blog.findById(req.body.id));
};

module.exports.add_single_blog = async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    is_deleted: req.body.is_deleted,
  });
  await blog.save();
  res.send("Created a new Blog!");
};
