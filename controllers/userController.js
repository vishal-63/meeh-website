const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const client = new OAuth2Client(process.env.GOOGLE_OATH_CLIENT_ID);

const maxAge = 3 * 24 * 60 * 60;

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

module.exports.login_get = (req, res) => {
  res.render("login");
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

module.exports.singup_get = (req, res) => {
  res.render("register");
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

module.exports.signup_post = async (req, res) => {
  const { first_name, last_name, email, phone_no, password, confirm_password } =
    req.body;

  console.log(req.body.body);
  try {
    if (password === confirm_password) {
      const user = await new User({
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
