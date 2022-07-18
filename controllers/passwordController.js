const User = require("../models/user");
const jwt = require("jsonwebtoken");
const path = require('path');
const bcrypt = require("bcrypt");

//for mailing apis;
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');


const createJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};


//controlles get request when user wants to change password
module.exports.change_password_get = async (req,res)=>{
    res.render("changePassword");
}

module.exports.change_password_post = async (req,res)=>{

    const {old_password,new_password,confirm_password} = req.body;
    const user = await User.findById(res.user.id);
    try{
        if(user == null || user == undefined){
            throw new Error("User not found!")
        }
        else{
            const passwordMatched = bcrypt.compare(old_password, user.password);
            if(passwordMatched && new_password == confirm_password){
                user.password = new_password;
                user.save((err,result)=>{
                    if(err){
                        throw new Error("Error while saveing new password!");
                    }
                    else{
                        console.log(result);
                        res.status(200).send(result);
                    }
                });
            }
        }
    }catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }

}


//controlles get request for when user has forgot password
module.exports.forgot_password_get = async (req,res) => {
    res.render('forgotPassword');
  }
  
module.exports.forgot_password_post = async (req,res) => {
    try{

        const user = await User.findOne({email:req.body.email});
        if(user!=null && user != undefined){


        //send top to email
            const emailToken=createJWT(req.body.email);
            const transporter = nodemailer.createTransport(
                {
                    service: 'outlook',
                    auth:{
                        user: 'sdkm7016816547@gmail.com',
                        pass: 'K!ngkongde@dp00l'
                    }
                }
            );

            const handlebarOptions = {
                viewEngine: {
                    partialsDir: path.resolve('./views/'),
                    defaultLayout: false,
                },
                viewPath: path.resolve('./views/'),
            };

            transporter.use('compile', hbs(handlebarOptions));

            const mailOptions = {
                from: '"Meehh.com" <sdkm7016816547@gmail.com>', // sender address
                to: req.body.email, // list of receivers
                subject: 'Welcome!',
                template: 'email', // the name of the template file i.e email.handlebars
                context:{
                    link:"localhost:5000/profile/resetForgottenPassword?token="+emailToken // replace {{company}} with My Company
                }
            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
                res.status(200).send("Link to reset password is successfully sent!");
            });        
        }
        else{
            throw new Error("user not found");
        }

    }catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }
}


module.exports.reset_forgotten_password_get = async (req,res) => {
    console.log(req.query.token);
    const email = jwt.verify(req.query.token,process.env.JWT_SECRET_KEY);
    //send email in cookie
    console.log(email);
    res.render("resetForgottenPassword",{email:email.id});

}

module.exports.reset_forgotten_password_post = async (req,res) => {
    try{

        const email=null;
        const {new_password,confirm_password} = req.body;

        
        //find user by email;
        if(new_password == confirm_password){
        
            const user = await User.findOne({email:email});
            user.password = req.body.password;
            user.save((err,result)=>{
            if(err){
                throw new Error("Failed to update password!");
            }
            else{
                forgot_password.delete();
                console.log(result);
                res.redirect("/login");
            }
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }
}