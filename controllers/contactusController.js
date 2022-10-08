const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");

module.exports.send_mail = async (req, res) => {
  try {
    const { username, email, subject, phone, message } = req.body;

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
      from: `${username} <${email}>`,
      to: "meehhofficial@gmail.com",
      subject: subject,
      template: "contactus",
      sender: email,
      replyTo: email,
      inReplyTo: subject,
      attachments: [
        {
          filename: "logo.png",
          path: process.cwd() + "/public/assets/images/logo.png",
          cid: "logo",
        },
      ],
      context: { username, email, subject, phone, message },
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Login successful!" });
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.log(err, err.message);
    res.status(500).json({ err, message: err.message });
  }
};
