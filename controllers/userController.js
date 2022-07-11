const User = require("../models/user");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const jwtToken = createJWT(user._id);
    res.cookie("jwt", jwtToken, { httpOnly: true });
    res.redirect("/products");
  } catch (err) {
    console.log(err);
    res.render("login", { error: err.message });
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

  // validate errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach((e) => {
      errors[e.path] = e.message;
    });
  } else errors.confirm_password = err;

  return errors;
};

module.exports.signup_post = async (req, res) => {
  const { first_name, last_name, email, phone_no, password, confirm_password } =
    req.body;

  console.log(req.body);
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
      res.status(201).redirect("/products");
    } else throw Error("Passwords must match");
  } catch (err) {
    const errors = handleErrors(err);
    console.log(errors);
    res.status(400);
    res.render("register", { errors: errors });
  }
};
