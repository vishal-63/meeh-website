const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");

module.exports.send_mail = async (req,res)=>{
    const {username,email,subject,phone,message} = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "meehh.com@gmail.com",
          pass: "erbzccxasokppkla",
        },
      });

      const handlebarOptions = {
        viewEngine: {
          partialsDir: path.resolve("./views/"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./views/"),
      };

      transporter.use("compile",hbs(handlebarOptions));

      const mailOptions = {
        from:'"Meehh.com" <meehh.com@gmail.com>',
        to:"dreamworldprints01@gmail.com",
        subject:"Contact Us Email from Meehh.com",
        template:"contactus",
        attachments:[
          {
            filename: "logo.png",
            path: process.cwd() + "/public/assets/images/logo.png",
            cid: "logo",
          },
        ],
        context:{username,email,subject,phone,message},
      };

      transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            return console.log(error);
        }
        console.log("Email sent: "+ info.response);
        res.status(200).send("Message sent successfull.");
      })


    res.send(req.body);
}