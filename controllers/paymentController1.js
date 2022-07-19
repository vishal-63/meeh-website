const Razorpay = require('razorpay');
const Order = require('../models/order');

const instance = new Razorpay({
    key_id:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_SECRET,
});


module.exports.create_order = async (req,res)=>{

    console.log(req.body);

    const options ={
        amount:10000,
        currency:"INR",
        receipt:"pizzssa"
    }
    
    instance.orders.create(options,(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
            const order = Order({
                user_id:res.user.id,

            });
            res.render("razorpay",{key:process.env.RAZORPAY_KEY,order:result});
        }
    })

}

module.exports.verify_order = async (req,res)=>{
    
    const {razorpay_order_id , razorpay_payment_id , razorpay_signature} = req.body;

    generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret);

  if (generated_signature == razorpay_signature) {
    console.log("payment is successful");
  }
}