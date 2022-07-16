const Product = require("../models/product");
const User = require("../models/user");

module.exports.cart_get = async(req,res)=>{
  const user = await User.findById(res.user.id);
  await user.populate({
    path:'cart.product_id',
    model:Product,
  });
  const cart = user.cart;
  res.render("cart",{cart:cart});
}

module.exports.cart_add_product = async (req,res)=>{
  const user = await User.findById(res.user.id);
  let count=false;
  
  try{

    const product = await Product.findById({_id:req.body.id});
    if(product == null || product == undefined){
      throw new Error({message:"The product that user wants to add is not found!"});
    }
    user.cart.map((item)=>{
      if(item.product_id == req.body.id && 
        item.selected_color == req.body.selected_color && 
        item.selected_size == req.body.selected_size){
          item.quantity+=req.body.quantity;
          count=true;
      }
    })
    if (!count){
      user.cart.push({
        product_id:product._id,
        quantity:req.body.quantity,
        selected_size:req.body.selected_size,
        selected_color:req.body.selected_color,
      });
    }

    console.log(user.cart);
    console.log(req.body);
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
    res.status(200).send({message:"Product deleted from cart"});

  }catch(err){
    console.log(err.message);
    res.status(400).send(err.message);
  }

}

module.exports.cart_update_product = async (req,res)=>{

  const user = await User.findById(res.user.id);
  console.log(user)

  try{
    console.log("request = ",req.body);
    
    user.cart.map( item => {
      if(item._id == req.body.id){
        item.quantity = item.quantity+ req.body.quantity;
      }
    });

    const newCart = user.cart.filter( item => {
      // console.log(item);
      return item.quantity > 0 ;
    } );
    
    console.log(newCart);
    user.cart = newCart;

    user.save((err,result)=>{
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else{
        // console.log(user.cart);
        res.status(200).send("success!");
      }
    })
    
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }

  
}