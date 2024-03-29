const User = require("../models/user");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcrypt");

const categoryController = require("../controllers/categoryController");
const cartController = require("../controllers/cartController");

//for mailing apis;
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

//controlles get request when user wants to change password
module.exports.change_password_get = async (req, res) => {
  let userLoggedIn = false;
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  if (req.cookies.jwt) {
    userLoggedIn = true;
  }

  res.render("changePassword", { userLoggedIn });
};

module.exports.change_password_post = async (req, res) => {
  const { old_password, new_password, confirm_password } = req.body;
  const user = await User.findById(res.user.id);
  try {
    if (user == null || user == undefined) {
      throw new Error("User not found!");
    }

    const passwordMatched = bcrypt.compare(old_password, user.password);

    if (passwordMatched && new_password == confirm_password) {
      user.password = await User.hashPassword(new_password);
      console.log(user.password);
      user.save((err, result) => {
        if (err) {
          throw new Error("Error while saving new password!");
        } else {
          console.log("password saved");
          res.redirect("/profile");
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

//controlles get request for when user has forgot password

module.exports.forgot_password_post = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user != null && user != undefined) {
      //send top to email
      const emailToken = createJWT(req.body.email);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const handlebarOptions = {
        viewEngine: {
          partialsDir: path.resolve("./views/"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./views/"),
      };

      transporter.use("compile", hbs(handlebarOptions));

      const mailOptions = {
        from: '"Meehh.com" <meehhofficial@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: "Welcome!",
        template: "email", // the name of the template file i.e email.handlebars,
        attachments: [
          {
            filename: "logo.png",
            path: process.cwd() + "/public/assets/images/logo.png",
            cid: "logo",
          },
        ],
        context: {
          name: user.first_name,
          link:
            "http://localhost:5000/profile/reset-password?token=" + emailToken, // replace {{company}} with My Company
        },
      };

      console.log(
        "http://localhost:5000/profile/reset-password?token=" + emailToken
      );

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: " + info.response);
        res.status(200).send("Link to reset password is successfully sent!");
      });
    } else {
      throw new Error("user not found");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

module.exports.reset_forgotten_password_get = async (req, res) => {
  console.log(req.query.token);
  const email = jwt.verify(req.query.token, process.env.JWT_SECRET_KEY);
  let userLoggedIn = false;
  if (req.cookies.jwt) {
    userLoggedIn = true;
  }
  const categories = await categoryController.getCategories();
  let cartLength = await cartController.get_cart_length(req.cookies.jwt);

  //send email in cookie
  console.log(email);
  res.render("changePassword", {
    categories,
    email: email.id,
    userLoggedIn,
    cartLength,
  });
};

module.exports.reset_forgotten_password_post = async (req, res) => {
  try {
    const { new_password, confirm_password, email } = req.body;

    //find user by email;
    if (new_password == confirm_password) {
      const user = await User.findOne({ email: email });
      user.password = await User.hashPassword(new_password);
      console.log(user.password);
      user.save((err, result) => {
        if (err) {
          throw new Error("Failed to update password!");
        } else {
          console.log("password saved");
          res.redirect("/login");
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};
