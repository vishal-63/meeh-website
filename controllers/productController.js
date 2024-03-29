const jwt = require("jsonwebtoken");

const Product = require("../models/product");
const User = require("../models/user");
const cartController = require("../controllers/cartController");
const categoryController = require("../controllers/categoryController");

module.exports.products_get = async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  const categories = await categoryController.getCategories();

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }
  if (req.query.category != null && req.query.category != undefined) {
    const productList = await Product.find({
      category: { $regex: req.query.category, $options: "i" },
      is_deleted: false,
    }).limit(100);
    res.render("products", {
      productList,
      userLoggedIn,
      productsLoaded: 0,
      cartLength,
      categories,
    });
  } else {
    const productList = {};

    for (let i = 0; i < categories.length; i++) {
      productList[categories[i].category_name] = await Product.find({
        category: { $regex: categories[i].category_name, $options: "i" },
        is_deleted: false,
      }).limit(8);
    }
    res.render("products", {
      productList,
      userLoggedIn,
      productsLoaded: 0,
      cartLength,
      categories,
    });
  }
};

module.exports.products_get_next = async (req, res) => {
  const productsLoaded = parseInt(req.body.productsLoaded);
  let newProducts;

  if (req.body.category) {
    newProducts = await Product.find({
      category: { $regex: req.body.category, $options: "i" },
      is_deleted: false,
    })
      .limit(100)
      .skip(productsLoaded);
  } else if (req.body.search) {
    const con = [];

    req.body.search.split(" ").map((text) => {
      con.push({ description: { $regex: text, $options: "i" } });
    });

    newProducts = await Product.find({ $and: con, is_deleted: false })
      .limit(100)
      .skip(parseInt(req.body.productsLoaded));
  } else {
    newProducts = await Product.find().limit(100).skip(productsLoaded);
  }
  res.send({ newProducts });
};

module.exports.single_product_get = async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  const categories = await categoryController.getCategories();

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  const product = await Product.findById(req.params.id);

  await product.populate({
    path: "reviews.user_id",
    model: User,
  });

  res.render("productdetails", {
    product,
    categories,
    userLoggedIn,
    cartLength,
  });
};

module.exports.products_get_search = async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  const categories = await categoryController.getCategories();

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  if (req.query["q"] != null) {
    let cartLength = await cartController.get_cart_length(req.cookies.jwt);
    // const productList = await Product.find({
    //   $or:[
    //     {category: { $regex: req.query['q'], $options: "i" }},
    //     {product_name: { $regex: req.query['q'], $options: "i" }},
    //   ],
    // }).limit(100);

    const con = [];

    req.query["q"].split(" ").map((text) => {
      con.push({ description: { $regex: text, $options: "i" } });
    });

    const productList = await Product.find({ $and: con, is_deleted: false })
      .limit(100)
      .skip(parseInt(req.body.productsLoaded));
    // const productList = await Product.find({ description:{  } }).limit(100)
    res.render("products", {
      productList,
      userLoggedIn,
      productsLoaded: 0,
      cartLength,
      categories,
    });
  } else {
    res.redirect("/products");
  }
};

// module.exports.products_get_by_category = async (req,res)=>{

//   let userLoggedIn = false;
//   if (req.cookies.jwt) {
//     userLoggedIn = true;
//   }

//   const productList = await Product.find( { category : { $regex : "a5 Diary" , "$options" : "i"} } );
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
