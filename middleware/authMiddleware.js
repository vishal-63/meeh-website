const jwt = require("jsonwebtoken");

const requireAuth = (req,res,next)=>{
    const token = req.jwt;

    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decodedToken))
    }
}