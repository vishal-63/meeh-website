const jwt = require("jsonwebtoken");

const Product = require("../models/product");
const User = require("../models/user");
const cartController = require("../controllers/cartController");

module.exports.products_get = async (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  if (req.query.category != null) {
    const productList = await Product.find({
      category: { $regex: req.query.category, $options: "i" },
    }).limit(100);
    res.render("products", { productList, userLoggedIn, productsLoaded: 0 });
  } else {
    const productList = await Product.find().limit(100);
    res.render("products", { productList, userLoggedIn, productsLoaded: 0 });
  }
};

module.exports.products_get_next = async (req, res) => {
  const productsLoaded = parseInt(req.body.productsLoaded);
  let newProducts;

  if (req.body.category) {
    newProducts = await Product.find({
      category: { $regex: req.body.category, $options: "i" },
    })
      .limit(100)
      .skip(productsLoaded);
  } else {
    newProducts = await Product.find().limit(100).skip(productsLoaded);
  }
  res.send({ newProducts });
};

module.exports.single_product_get = async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  const product = await Product.findById(req.params.id);

  await product.populate({
    path: "reviews.user_id",
    model: User,
  });

  res.render("productdetails", { product, userLoggedIn, cartLength });
};

module.exports.products_get_search = async (req, res) => {
  let userLoggedIn = false;
  if (req.query["q"] != null) {
    // const productList = await Product.find({
    //   $or:[
    //     {category: { $regex: req.query['q'], $options: "i" }},
    //     {product_name: { $regex: req.query['q'], $options: "i" }},
    //   ],
    // }).limit(100);
    console.log(req.query["q"]);

    const con = [];

    req.query["q"].split(" ").map((text) => {
      con.push({ description: { $regex: text, $options: "i" } });
    });

    const productList = await Product.find({ $and: con })
      .limit(100)
      .skip(parseInt(req.body.productsLoaded));
    // console.log(productList[0].inventory[0].large_images);
    // const productList = await Product.find({ description:{  } }).limit(100)
    res.render("products", { productList, userLoggedIn, productsLoaded: 0 });
  } else {
    const productList = await Product.find()
      .limit(100)
      .skip(parseInt(req.body.productsLoaded));

    console.log(productList[0].inventory[0].large_images);
    res.render("products", { productList, userLoggedIn, productsLoaded: 0 });
  }
};

// module.exports.products_get_by_category = async (req,res)=>{

//   let userLoggedIn = false;
//   if (req.cookies.jwt) {
//     userLoggedIn = true;
//   }

//   const productList = await Product.find( { category : { $regex : "a5 dairy" , "$options" : "i"} } );
//   console.log(productList.length);

//   // productList[0].price = 250;
//   // await productList[0].save();
//   // console.log(productList[0]);

//   for(let i=0 ; i < productList.length; i++){
//     productList[i].description = '- A5 standard size <br> - 100+ GSM milk white paper <br> - Suitable for doodle art and sketching alongside normal use <br> - Soft spiral bind <br> - 100 pages bind';
//     await productList[i].save();
//   }

//   res.render("products", { productList:productList, userLoggedIn:false,productsLoaded:0});
//   // res.send(productList);
// }
