const jwt = require("jsonwebtoken");

const Product = require("../models/product");
const User = require("../models/user");

const categoryController = require("../controllers/categoryController");

module.exports.get_cart_length = async (token) => {
  if (token) {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      (err, decodedToken) => {
        if (err) {
          console.log(err.message);
        } else {
          return decodedToken;
        }
      }
    );
    const user = await User.findById(decodedToken.id);
    const length = user.cart.length;
    return length;
  } else return 0;
};

async function decodeJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.log(err.message);
    } else {
      return decodedToken;
    }
  });
}

async function getCartData(req, res) {
  let userLoggedIn = false;

  let user;
  let cart = [];
  let addresses = [];

  const categories = await categoryController.getCategories();

  try {
    if (req.cookies.jwt) {
      userLoggedIn = true;
      const { id } = await decodeJWT(req.cookies.jwt);
      user = await User.findById(id);
      addresses = user.addresses;
    } else if (req.cookies.cart) {
      user = new User();
      cart = JSON.parse(req.cookies.cart);
      user.cart = cart;
    }

    if (user?.cart) {
      await user.populate({
        path: "cart.product_id",
        model: Product,
      });
      cart = user.cart;
    }

    return {
      cart,
      userLoggedIn,
      addresses,
      categories,
      cartLength: cart.length,
    };
  } catch (err) {
    console.log("An error occurred");
    console.log(err);
    console.log(err.message);
  }
}

module.exports.cart_get = async (req, res) => {
  res.render("cart", await getCartData(req, res));
};

module.exports.cart_shipping_get = async (req, res) => {
  res.render("shipping", await getCartData(req, res));
};

module.exports.cart_information_get = async (req, res) => {
  res.render("information", await getCartData(req, res));
};

module.exports.cart_add_product = async (req, res) => {
  const user = await User.findById(res.user.id);
  let count = false;
  console.log("adding to cart");
  console.log(user);
  try {
    const product = await Product.findById(req.body.product_id);
    if (product == null || product == undefined) {
      throw new Error({
        message: "The product that user wants to add is not found!",
      });
    }
    user.cart.map((item) => {
      if (
        item.product_id == req.body.id &&
        item.selected_color == req.body.selected_color &&
        item.selected_size == req.body.selected_size
      ) {
        item.quantity += req.body.quantity;
        count = true;
      }
    });
    if (!count) {
      user.cart.push({
        product_id: product._id,
        quantity: req.body.quantity,
        selected_size: req.body.selected_size,
        selected_color: req.body.selected_color,
      });
    }

    user.save((err, result) => {
      if (err) {
        throw new Error({ message: "Failed to add product to cart!" });
      }
    });
    console.log("added to cart");
    res.status(200).send("success!");
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
};

module.exports.cart_delete_product = async (req, res) => {
  const user = await User.findById(res.user.id);
  console.log("deleting cart");
  try {
    const newCart = user.cart.filter((item) => {
      return item._id != req.body.id;
    });

    user.cart = newCart;
    await user.save();

    user.populate({
      path: "cart.product_id",
      model: Product,
    });

    const cart = user.cart;
    res.status(200).send({ message: "Product deleted from cart" });
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
};

module.exports.cart_update_product = async (req, res) => {
  const user = await User.findById(res.user.id);
  console.log(req.body);
  console.log(user);
  try {
    user.cart.map((item) => {
      if (item._id == req.body.id) {
        item.quantity = item.quantity + req.body.quantity;
      }
    });

    user.cart = user.cart.filter((item) => {
      return item.quantity > 0;
    });

    user.save((err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        console.log(result.cart);
        res.status(200).json(result.cart);
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
};
