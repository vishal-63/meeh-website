const User = require("../models/User");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60 ;

const createJWT = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{
        expiresIn:maxAge,
    });    
}

module.exports.login_get = (req,res)=>{
    res.render('login');
}

module.exports.login_post = async (req,res)=>{
    const {email,password} = req.body;
    
    try{
        
        const user = await User.login(email,password);
        const jwtTokken = createJWT(user._id);
        res.cookie("jwt",jwtTokken,{ httpOnly:true , maxAge: maxAge*1000 });
        res.redirect("/products");

    }catch(err){
        console.log(err);
        res.render('login',{error:err.message})
    }
}

module.exports.singup_get = (req,res)=>{
    res.render('register');
}

module.exports.singup_post = (req,res)=>{
    res.json({"heloo":"hello"});
}