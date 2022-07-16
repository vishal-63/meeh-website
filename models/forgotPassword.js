const mongoose = require("mongoose");
const {isEmail} = require("validator");

const forgotPasswordSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        validate:[isEmail,"Invalid email!"]
    },
    otp:{
        type:Number,
        required:true,
    },
    expires_at:{
        type:Date,
        default:Date.now,
        expires:120,
    }
});

const ForgotPassword = mongoose.model('forgotpassword',forgotPasswordSchema);

module.exports = ForgotPassword;