const jwt = require("jsonwebtoken");

const Product = require("../models/product");
const User = require("../models/user");

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
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.log(err.message);
    } else {
      return decodedToken;
    }
  });
}

async function getCartData(req, res) {
  let userLoggedIn = false;
  let cart;

  let user;
  let addresses;

  if (req.cookies.jwt) {
    userLoggedIn = true;
    user = await User.findById(decodeJWT(req.cookies.jwt));
    await user.populate({
      path: "cart.product_id",
      model: Product,
    });
    addresses = user.addresses || [];
  } else if (req.cookies.cart) {
    cart = JSON.parse(req.cookies.cart);
  }

  return {
    cart,
    userLoggedIn,
    addresses,
    cartLength: cart.length,
  };
}

module.exports.cart_get = async (req, res) => {
  res.render("cart", await getCartData(req, res));
};

module.exports.cart_shipping_get = async (req, res) => {
  res.render("shipping", await getCartData(req, res));
};

module.exports.cart_add_product = async (req, res) => {
  const user = await User.findById(res.user.id);
  let count = false;

  try {
    const product = await Product.findById({ _id: req.body.id });
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
    res.status(200).send("success!");
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
};

module.exports.cart_delete_product = async (req, res) => {
  const user = await User.findById(res.user.id);

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
  // console.log(user)

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
        res.status(200).send(result.cart);
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
};
