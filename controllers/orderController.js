const Coupon = require("../models/coupon");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

module.exports.get_user_orders = async (req, res) => {
  const orders = await Order.find({ user_id: res.user.id });
  res.send(orders);
};

module.exports.createDbOrder = async (
  userId,
  cart,
  address,
  instantBuy,
  productCookie
) => {
  try {
    let order = new Order();
    order.user_id = userId;

    if (instantBuy) {
      const product = await Product.findById(productCookie.id);
      order.products = [
        {
          product_id: product._id,
          details: "",
          quantity: productCookie.quantity,
          total_amt:
            productCookie.quantity * (product.price - (product.discount || 0)),
        },
      ];
    } else {
      console.log(cart);
      const productPromises = cart.map(async function (item, index) {
        return Product.findById(item.product_id._id).then(function (product) {
          console.log(
            product.price,
            product.discount,
            product.price - (product.discount || 0)
          );
          return {
            product_id: product._id,
            details: item.selected_size + "_" + item.selected_color,
            quantity: item.quantity,
            total_amt:
              item.quantity * (product.price - (product.discount || 0)),
          };
        });
      });
      order.products = await Promise.all(productPromises);
    }

    order.sub_total = order.products.reduce(
      (sum, product) => sum + product.total_amt,
      0
    );

    console.log(order.sub_total);

    // let couponDiscount = 0;

    order.coupon = null;

    // if (order.sub_total > coupon?.min_total) {
    //   if (coupon?.percentage) {
    //     couponDiscount =
    //       (order.sub_total * coupon?.percentage) / 100 > coupon?.max_discount
    //         ? coupon?.max_discount
    //         : (order.sub_total * coupon?.percentage) / 100;
    //   } else {
    //     couponDiscount = coupon?.amount;
    //   }
    // }

    // order.coupon = {
    //   coupon_id: coupon?._id,
    //   discount: couponDiscount,
    // };

    var total = order.sub_total - (order.coupon?.discount || 0);

    order.shipping_cost = total > 800 ? 0 : 80;

    order.grand_total = total + order.shipping_cost;
    console.log(
      order.grand_total,
      total + order.shipping_cost,
      order.sub_total
    );
    order.shipping_address = address;

    console.log(order);
    return order;
  } catch (err) {
    console.log(err);
  }
};
