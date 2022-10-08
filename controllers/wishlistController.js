const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Product = require("../models/product");

const cartController = require("../controllers/cartController");

async function decodeJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.log(err.message);
    } else {
      return decodedToken;
    }
  });
}

module.exports.wishlist_get = async (req, res) => {
  let userLoggedIn = false;

  let user;
  let wishlist = [];
  let cartLength;

  try {
    if (req.cookies.jwt) {
      userLoggedIn = true;
      const { id } = await decodeJWT(req.cookies.jwt);
      user = await User.findById(id);
    } else if (req.cookies.wishlist) {
      user = new User();
      wishlist = JSON.parse(req.cookies.wishlist);
      user.wishlist = wishlist;
    }

    if (user?.wishlist) {
      await user.populate({
        path: "wishlist",
        model: Product,
      });
      wishlist = user.wishlist;
    }

    cartLength = user.cart
      ? user.cart.length
      : JSON.parse(req.cookies.cart).length;

    res.render("wishlist", {
      wishlist,
      userLoggedIn,
      cartLength,
    });
  } catch (err) {
    console.log("An error occurred");
    console.log(err);
    console.log(err.message);
    res.sendStatus(err.message);
  }
};

module.exports.add_wishlist_post = async (req, res) => {
  const user = await User.findById(res.user.id);

  await Product.exists({ _id: req.body.id }, (err, result) => {
    try {
      if (err) {
        throw new Error({ message: "Product not found!" });
      } else if (result == null) {
        throw new Error({ message: "Product not found!" });
      } else {
        if (!user.wishlist.includes(req.body.id)) {
          user.wishlist.push(result._id);
          user.save((err, result) => {
            if (err) {
              throw new Error({
                message: "Failed to add product to wishlist!",
              });
            }
          });

          res.status(200).send("success!");
        } else {
          res.status(200).send("Already in your wishlist!");
        }
      }
    } catch (err) {
      console.log(err);
      res.status(404).send({ error: "Product not found!" });
    }
  });
};

module.exports.delete_wishlist_post = async (req, res) => {
  try {
    const user = await User.findById(res.user.id);

    const newWishlist = user.wishlist.filter((product) => {
      return product._id != req.body.id;
    });

    user.wishlist = newWishlist;
    await user.save();

    await user.populate({
      path: "wishlist",
      model: Product,
    });
    res.send("Success");
  } catch (err) {
    console.log(err.message);
  }
};
