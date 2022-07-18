const User = require("../models/user");
const jwt = require("jsonwebtoken");


const maxAge = 3 * 24 * 60 * 60;

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

// Handles signup error
const handleErrors = (err) => {
  let errors = {
    first_name: null,
    last_name: null,
    email: null,
    password: null,
    phone_no: null,
    confirm_password: null,
  };
  console.log(err.message, err.code);

  //   Check for duplicate email with err.code
  if (err.code == 11000) {
    errors.email = "Email already exists";
    return errors;
  }

  console.log(err);

  // validate errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach((e) => {
      errors[e.path] = e.message;
    });
  } else errors.confirm_password = err.message;

  return errors;
};

module.exports.login_get = (req, res) => {
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("login", { userLoggedIn });
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.login(email, password);
    const jwtToken = createJWT(user._id);
    res.cookie("jwt", jwtToken, { httpOnly: true });
    res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

//controlles signup / register
module.exports.singup_get = (req, res) => {
  res.render("register");
};

//controlles signup / register post request from unregistered users.
module.exports.signup_post = async (req, res) => {
  const { first_name, last_name, email, phone_no, password, confirm_password } =
    req.body;

  console.log(req.body.body);
  try {
    if (password === confirm_password) {
      const user = User({
        first_name,
        last_name,
        email,
        phone_no,
        password,
      });
      await user.save();

      const jwtToken = createJWT(user._id);
      res.cookie("jwt", jwtToken, { httpOnly: true });
      res.status(201).json({ message: "Registration Successful" });
    } else throw Error("Passwords must match");
  } catch (err) {
    const errors = handleErrors(err);
    console.log(errors);
    res.status(400).json({ errors: errors });
  }
};

//controlles get request to account/ profile page for users
module.exports.profile_get = async (req, res) => {
  res.render("about");
};

//controlles post request to change account / profile for users
module.exports.profile_post = async (req, res) => {
  const {
    first_name,
    last_name,
    phone,
    state,
    city,
    street,
    house_no,
    landmark,
    pincode,
  } = req.body;
  console.log(req.body.userDetails);
  try {
    const user = User.findById(res.user.id);
    user.first_name = first_name;
    user.last_name = last_name;
    user.phone_no = phone;
    user.adresses.state = state;
    user.adresses.city = city;
    user.adresses.street = street;
    user.adresses.house_no = house_no;
    user.adresses.landmark = landmark;
    user.adresses.pincode = pincode;
    user.save((err, result) => {
      if (err) {
        console.log(err.message);
        throw new Error("Could not save user details!");
      } else {
        console.log(result);
        res.redirect("userAccount");
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
};

//controlles get request for when user has forgot password
module.exports.forgot_password_get = async (req, res) => {
  res.render("forgotPassword.ejs");
};

module.exports.forgot_password_post = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user != null && user != undefined) {
      //send top to email
      const OTP = Math.floor(100000 + Math.random() * 900000);
      let forgotPassword = await ForgotPassword.findOne({ email: user.email });

      if (forgotPassword != null) {
        await forgotPassword.delete();
      }

      forgotPassword = new ForgotPassword({
        email: user.email,
        otp: OTP,
      });

      forgotPassword.save((err, result) => {
        if (err) {
          throw new Error("Error while saving new otp!");
        } else {
          console.log(result);
          res.send(result);
        }
      });
      // res.send(forgotPassword);
    } else {
      res.status(400).send("user not found");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

module.exports.forgot_password_verify_get = (req, res) => {
  res.render("forgotpasswordverify");
};

module.exports.forgot_password_verify_post = async (req, res) => {
  if (req.password == req.confirm_password) {
  } else {
    res.status(400).send("Password do not match!");
  }
};
