const Order = require("../models/order");

const createOrder = async (o) => {
  let order = new Order();
  order.user_id = o.userId;

  const productPromises = o.productIds.map(async function (pId, index) {
    return Product.findById(pId).then(function (product) {
      const p = {};
      p.product_id = product._id;
      p.quantity = o.quantity[index];
      p.total_amt = o.quantity[index] * (product.price - product.discount);
      return p;
    });
  });

  order.products = await Promise.all(productPromises);

  order.sub_total = order.products.reduce(
    (sum, product) => sum + product.total_amt,
    0
  );

  let couponDiscount = 0;
  const coupon = await Coupon.findById("62c8149c8bbe80c846ff9e73");
  console.log(coupon.min_total);
  if (order.sub_total > coupon.min_total) {
    if (coupon.percentage) {
      couponDiscount =
        (order.sub_total * coupon.percentage) / 100 > coupon.max_discount
          ? coupon.max_discount
          : (order.sub_total * coupon.percentage) / 100;
    } else {
      couponDiscount = coupon.amount;
    }
    console.log(couponDiscount);
  }
  order.coupon = {
    coupon_id: o.coupon_id,
    discount: couponDiscount,
  };

  order.grand_total = order.sub_total - order.coupon.discount;

  order.order_status = "Ordered";
  order.payment_id = "random_payment_id";

  order
    .save()
    .then(() => console.log(order))
    .catch((err) => console.log(err.message));
};
