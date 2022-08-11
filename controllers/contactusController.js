const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");

module.exports.send_mail = async (req,res)=>{
    const {username,email,subject,phone,message} = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "meehh.com@gmail.com",
          pass: "dreamworldprints01@gmail.com",
        },
      });

      const handlebarOptions = {
        viewEngine: {
          partialsDir: path.resolve("./views/"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./views/"),
      };


    res.send(req.body);
}