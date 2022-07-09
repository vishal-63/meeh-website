const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const maxAge = 3 * 24 * 60 * 60;

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

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

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.login_post = (req, res) => {
  const { email, password } = req.body;
  try {
  } catch (err) {
    console.log(err.message);
  }
};

module.exports.signup_get = (req, res) => {
  res.render("register");
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
