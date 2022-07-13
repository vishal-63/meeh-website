const User = require("../models/user");
const Product = require('../models/product');

module.exports.wishlist_get =async (req,res)=>{
    const user = await User.findById(res.user.id);
    await user.populate({
        path:'wishlist',
        model:Product,
    });
    const wishlist = user.wishlist;
    res.render('wishlist',{wishlist:wishlist});
}

module.exports.add_wishlist_post = async (req,res)=>{
    console.log(req.body);
    console.log("hello");
    const user = await User.findById(res.user.id);

    await Product.exists({_id:req.body.id},(err,result)=>{
        try{
            if(err){
                throw new Error({message:"Product not found!"});
            }
            else if(result == null){
                throw new Error({message:"Product not found!"});
            }
            else{
                // console.log(req.body.id);
                // console.log(result);
                // console.log(user.wishlist.includes(req.body.id));
                // console.log(user.wishlist)
                if( !user.wishlist.includes(req.body.id) ){
                    user.wishlist.push(result._id);
                    user.save((err,result)=>{
                        if(err){
                            throw new Error({message:"Failed to add product to wishlist!"});
                        }
                    })
                    
                    // console.log(0);
                    res.status(200).send("success!");
                }
                else{
                    
                    console.log(1);
                    res.status(200).send("Already in your wishlist!");
                }
                
                
            }
        }
        catch(err){
            console.log(err);
            res.status(404).send({error:"Product not found!"});
        }
    })

    // const newWishlist = user.wishlist.filter((product)=>{
    //     return product._id != req.body.id
    // });
    // console.log(newWishlist);    

    // user.wishlist = newWishlist;
    // await user.save();  

    // await user.populate({
    //     path:'wishlist',
    //     model:Product,
    // });

    
    // console.log(user.wishlist); 
    
    // const wishlist = user.wishlist;
    // res.render('wishlist',{wishlist:wishlist});
}

module.exports.delete_wishlist_post = async (req,res)=>{
    
    try{
        const user = await User.findById(res.user.id);

        const newWishlist = user.wishlist.filter((product)=>{
            return product._id != req.body.id
        });    

        user.wishlist = newWishlist;
        await user.save();  

        await user.populate({
            path:'wishlist',
            model:Product,
        });
        const wishlist = user.wishlist;
        console.log(0);
        res.redirect('/');
        // res.render('wishlist',{wishlist:wishlist});
    }
    catch(err){
        console.log(err.message)
    }
    
}