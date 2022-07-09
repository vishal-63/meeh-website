const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const maxAge = 3 * 24 * 60 * 60 ;

const createJWT = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{
        expiresIn:maxAge,
    });    
}

module.exports.login_get = (req,res)=>{
    res.render('login');
}

module.exports.login_post = (req,res)=>{
    const {email,password} = req.body;
    try{

    }catch(err){
        console.log(err.message);
    }
}

module.exports.singup_get = (req,res)=>{
    res.render('register');
}

module.exports.singup_post = (req,res)=>{
    res.json({"heloo":"hello"});
}