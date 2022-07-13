const Product = require("../models/product");
const User = require("../models/user");

module.exports.cart_get = async(req,res)=>{
  const user = await User.findById(res.user.id);
  await user.populate({
    path:'cart.product_id',
    model:Product,
  });
  const cart = user.cart;
  console.log(cart);
  res.render("cart",{cart:cart});
}

module.exports.cart_add_product = async (req,res)=>{
  const user = await User.findById(res.user.id);
  
  try{

    const product = await Product.findById({_id:req.body.id});
    user.cart.push({product_id:product._id,quantity:req.body.quantity});
    user.save((err,result)=>{
      if(err){
        throw new Error({message:"Failed to add product to cart!"});
      }
    })
    console.log(user.cart);
    res.status(200).send("success!");

  }catch(err){

    console.log(err.message);
    res.status(400).send(err.message);

  }
}

module.exports.cart_delete_product = async (req,res)=>{
  const user = await User.findById(res.user.id);

  try{

    const newCart = user.cart.filter((item)=>{
      return item._id != req.body.id;
    });
    user.cart = newCart;
    await user.save();
    user.populate({
      path:'cart.product_id',
      model:Product,
    });
    const cart = user.cart;
    console.log(cart);
    res.render("cart",{cart:cart});

  }catch(err){
    console.log(err.message);
    res.status(400).send(err.message);
  }
}