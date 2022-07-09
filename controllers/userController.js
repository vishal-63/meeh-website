const User = require("../models/user");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;

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

const handleErrors = (err) => {
  let errors = {};
  console.log(err.message, err.code);

  //   Check for duplicate email with err.code
  if (err.code == 11000) {
    errors.email = "Email already exists";
    return errors;
  }

  // validate errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach((e) => {
      errors[e.path] = e.message;
    });
  }

  return errors;
};

module.exports.signup_post = async (req, res) => {
  console.log(req.body);
  const { first_name, last_name, email, phone_no, password, confirm_password } =
    req.body;
  try {
    const user = await new User({
      first_name,
      last_name,
      email,
      phone_no,
      password,
    });
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
