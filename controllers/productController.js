const Product = require("../models/product");
const User = require("../models/user");

module.exports.products_get = async (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  if(req.query.category != null){
    // console.log(req.query.category);
    const productList = await Product.find({ "category" : {$regex:req.query.category, $options:"i"} }).limit(4);
    // console.log(productList);
    res.render("products",{productList,userLoggedIn,productsLoaded:0});
  }else{
    const productList = await Product.find().limit(4);
    res.render("products", { productList, userLoggedIn,productsLoaded:0});
  }

};

module.exports.products_get_next = async(req,res) =>{
  
  const productsLoaded = parseInt(req.body.productsLoaded)+2;
  const newProducts = await Product.find().limit(4).skip(productsLoaded);  
  res.send({newProducts});
}

module.exports.single_product_get = async (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  const product = await Product.findById(req.params.id);

  await product.populate({
    path:"reviews.user_id",
    model:User
  });

  console.log(product);

  res.render("productdetails", { product, userLoggedIn });
};

module.exports.products_get_categories = async(req,res)=>{
  res.send("hello");
}

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
