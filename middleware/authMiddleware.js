const jwt = require("jsonwebtoken");

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect("/login");
            }
            else{
                console.log(decodedToken);
                res.local.userid=decodedToken;
                next();
            }
        });
    }
    else{
        res.redirect("/login");
    }
}

module.exports = {requireAuth};