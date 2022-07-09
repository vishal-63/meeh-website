const Cart = require("../models/cart");

const addToCart = async ({ userId, productId, quantity }) => {
  let cart = await Cart.findOne({ userId: userId });
  console.log(cart);
  if (cart == null) {
    cart = new Cart();
    cart.user_id = userId;
  }
  const products = cart.products || [];
  products.push({
    product_id: productId,
    quantity: quantity,
  });
  cart.products = products;
  console.log(cart);
  cart
    .save()
    .then((cart) => console.log(cart))
    .catch((err) => console.log(err.message));
};
