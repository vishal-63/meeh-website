const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const Blog = require("../models/blog");
const ImageKit = require("imagekit");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Category = require("../models/category");

//helper
const notFound = async (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("not-found", { userLoggedIn });
};

//image kit helper

const imageKit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_SECRET_KEY,
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
});

module.exports.imagekitAuth = async (req, res) => {
  var result = imageKit.getAuthenticationParameters();
  res.json(result);
};

module.exports.delete_image = async (req, res) => {
  const fileId = req.body.fileId;
  console.log(fileId);
  if (fileId !== null && fileId !== undefined) {
    imageKit.deleteFile(fileId, function (error, result) {
      if (error) {
        console.log(error);
        res.status(501).json({
          error: err.message,
          message:
            "An error occurred while deleting the image. Please try again later!",
        });
      } else {
        console.log("Image deleted");
        res
          .status(200)
          .json({ message: "Image deleted successfully!", deleted: true });
      }
    });
  } else {
    res.status(200);
  }
};

const uploadToImageKit1 = async (largeImgBuffer, fileName) => {
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

const isAdmin = (token) => {
  //getting jwt from user req
  // const token = req.headers.authorization;

  token = token.split(" ")[1];

  if (token) {
    return jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          return false;
        } else {
          const user = await User.findById(decodedToken.id);
          return user.is_admin;
        }
      }
    );
  }
  return false;
};

//authentication

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.login(email, password);
    console.log(user);

    if (!user.is_admin) {
      res.status(400).json({ error: "User is not authorized" });
      return;
    }
    const jwtToken = createJWT(user._id);

    const data = {
      user_info: [user.first_name, user.last_name],
      jwt: jwtToken,
    };

    // res.cookie("jwt", jwtToken, { httpOnly: true });
    // res.status(200).json({ message: "Login successful!" });

    //sending data of admin with jwt token;
    res.json(data);
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
};

//products
module.exports.get_products = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
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
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.change_product_state = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
    const product = await Product.findById(req.params.id);
    product.is_deleted = !product.is_deleted;
    await product.save();
    res.send(product.is_deleted ? "Product deactivated" : "Product Activated");
  } catch (err) {
    console.log(err, err.message);
    res.status(502).json({ message: "Invalid authorization" });
  }
};

module.exports.get_single_product = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    console.log(err);
    res.json({ error: err.message });
    // notFound(req, res);
  }
};

module.exports.set_single_product = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
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
      product.inventory[0].thumbnail_images = updated.thumbnail_images_links;
      product.inventory[0].large_images = updated.large_images_links;

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
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.post_add_product = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }

    const data = req.body;
    console.log(data);

    const product = new Product({
      product_name: data.product_name,
      description: data.description,
      size: data.size || [],
      color: data.color || [],
      price: data.price,
      inventory: {
        color_id: "",
        stock: data.stock || 0,
        thumbnail_images: data.thumbnail_images_links,
        large_images: data.large_images_links,
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
            "An error occurred while saving the product. Please try again later!",
        });
      } else {
        console.log("Product added");
        console.log(result);
        res.status(201).json({ message: "Product added successfully!" });
      }
    });
  } catch (err) {
    console.log("controller", err);
    res.status(500).json({ error: err, message: "Internal server error!" });
  }
};

//users
module.exports.get_users = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(400).json({ error: "Invalid authorization." });
    }

    const users = await User.find();
    console.log("users requested");
    res.json(users);
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.get_single_user = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
    const user = await User.findById(req.params.id);
    await user.populate({
      path: "cart.product_id",
      model: Product,
    });
    console.log(user);
    res.json(user);
  } catch (err) {
    notFound(req, res);
  }
};

module.exports.set_single_user = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
    const updated = req.body;
    const user = await User.findById(req.body._id);
    user.first_name = updated.first_name;
    user.last_name = updated.last_name;
    user.email = updated.email;
    user.phone_no = updated.phone_no;
    user.is_deleted = updated.is_deleted;
    await user.save();
    res.json(await User.findById(req.body._id));
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
};

//orders
module.exports.get_orders = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
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
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.get_single_order = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
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
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
    const coupons = await Coupon.find();
    res.send(coupons);
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.get_single_coupon = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
    const coupon = await Coupon.findById(req.params.id);
    res.send(coupon);
  } catch (err) {
    notFound(req, res);
  }
};

module.exports.change_coupon_state = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }

    const coupon = await Coupon.findById(req.params.id);
    coupon.is_deleted = !coupon.is_deleted;
    await coupon.save();
    res
      .status(201)
      .send(coupon.is_deleted ? "Coupon deactivated" : "Coupon Activated");
  } catch (err) {
    console.log(err, err.message);
    res.status(502).send(err.message);
  }
};

module.exports.set_coupons = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
    const coupon = await Coupon.findById(req.params.id);
    const updated = req.body;
    coupon.coupon_code = updated.coupon_code;
    coupon.amount = updated.amount;
    coupon.percentage = updated.percentage;
    coupon.max_discount = updated.max_discount;
    coupon.min_total = updated.min_total;
    coupon.is_deleted = updated.is_deleted;
    coupon.save(function (err, result) {
      if (err) {
        res.status(500).json({
          error: err.message,
          message:
            "An error has occurred while saving the coupon. Please try again later!",
        });
      } else {
        console.log("Coupon updated");
        res.status(201).json({ message: "Coupon updated successfully!" });
      }
    });
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({
      error: err.message,
      message:
        "An error has occurred while saving the coupon. Please try again later!",
    });
  }
};

module.exports.add_coupon = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
    const coupon = new Coupon({
      coupon_code: req.body.coupon_code,
      amount: req.body.amount,
      percentage: req.body.percentage,
      max_discount: req.body.max_discount,
      min_total: req.body.min_total,
    });
    coupon.save(function (err, result) {
      if (err) {
        console.log(err, err.message);
        res.status(501).json({
          error: err.message,
          message: "An error occurred. Please try again later.",
        });
      } else {
        console.log("Coupon created", result);
        res.status(201).json({ message: "Coupon created successfully." });
      }
    });
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({
      error: err.message,
      message: "An error occurred. Please try again later.",
    });
  }
};

//categories
module.exports.get_categories = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.update_category = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }

    let category;
    const id = req.body.category_id;

    if (id) category = await Category.findById(id);
    else category = new Category();

    category.category_name = req.body.category_name;
    category.save((err, result) => {
      if (err) {
        console.log(err, err.message);
        res.status(500).json({
          message:
            "An error occurred while saving the category. Please try again later!",
          error: err.message,
        });
      } else {
        console.log(result);
        res.status(201).json({ message: "Category saved!" });
      }
    });
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({
      message:
        "An error occurred while saving the category. Please try again later!",
      error: err.message,
    });
  }
};

module.exports.delete_category = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }

    const id = req.body.category_id;
    Category.findByIdAndDelete(id, (err, result) => {
      if (err) {
        console.log(err, err.message);
        res.status(500).json({
          message:
            "An error occurred while deleting the category. Please try again later!",
          error: err.message,
        });
      } else {
        console.log(result);
        res.status(201).json({ message: "Category deleted!" });
      }
    });
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({
      message:
        "An error occurred while deleting the category. Please try again later!",
      error: err.message,
    });
  }
};

//blogs
module.exports.get_blogs = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
    const blogs = await Blog.find();
    res.send(blogs);
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.get_single_blog = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
    const blog = await Blog.findById(req.params.id);
    console.log(blog);
    res.send(blog);
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.set_single_blog = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
    const blog = await Blog.findById(req.body.id);
    const updated = req.body;
    blog.title = updated.title;
    blog.content = updated.content;
    blog.tags = updated.tags;
    blog.is_deleted = updated.is_deleted;
    await blog.save();
    res.send(await Blog.findById(req.body.id));
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.add_single_blog = async (req, res) => {
  try {
    if (!isAdmin(req.headers.authorization)) {
      res.status(502).json({ message: "Invalid authorization" });
      return;
    }
    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
      is_deleted: req.body.is_deleted,
    });
    await blog.save();
    res.send("Created a new Blog!");
  } catch (err) {
    console.log("controller", err);
    res.status(400).json({ error: err.message });
  }
};
