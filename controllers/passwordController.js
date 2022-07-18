const User = require("../models/user");
const jwt = require("jsonwebtoken");
const path = require("path");

//for mailing apis;
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");

//controlles get request for when user has forgot password
module.exports.forgot_password_get = async (req, res) => {
  res.render("forgotPassword");
};

module.exports.forgot_password_post = async (req, res) => {
  try {
    console.log("email = ", req.body.email);
    const user = await User.findOne({ email: req.body.email });
    if (user != null && user != undefined) {
      //send top to email
      console.log(process.env.NODE_ENV);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "shahvishal662@gmail.com",
          pass: "eaajehtruffoslze",
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

      var mailOptions = {
        from: 'Meehh.com" <shahvishal662@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: "Meehh.com - Recover Password",
        template: "email", // the name of the template file i.e email.handlebars
        attachments: [
          {
            filename: "logo.png",
            path: process.cwd() + "/public/assets/images/logo.png",
            cid: "logo",
          },
        ],
        context: {
          name: user.first_name,
          link: "http://localhost:5000",
        },
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: " + info.response);
        res.json({ response: info.response });
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
  const email = jwt.verify(req.query.token, process.env.JWT_SECRET_KEY);
  console.log(email);

  res.render("forgotpasswordverify", { email: email });
};

module.exports.reset_forgotten_password_post = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    const forgot_password = await ForgotPassword.findOne({ email: email });
    if (forgot_password == null || forgot_password == undefined) {
      throw new Error("No otp has been send to this email!");
    } else if (newPassword == confirmPassword) {
      if (otp == forgot_password.otp) {
        const user = await User.findOne({ email: email });
        user.password = req.body.password;
        user.save((err, result) => {
          if (err) {
            throw new Error("Failed to update password!");
          } else {
            forgot_password.delete();
            console.log(result);
            res.redirect("/login");
          }
        });
      } else {
        throw new Error("Incorrect OTP!");
      }
    } else {
      res.status(400).send("Password do not match!");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};
