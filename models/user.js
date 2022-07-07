const mongoose = require("mongoose");
const {isEmail} = require("validator");

const userSchema = new mongoose.Schema({
    
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        validate:isEmail
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    phone_no:{
        type:String,
        required:true,
    },
    adresses:{
        type:[{
            state:{
                type:String,
                required:true,
            },
            city:{
                type:String,
                required:true,
            },
            street:{
                type:String,
                required:true,
            },
            house_no:{
                type:String,
                required:true,
            },
            landmark:{
                type:String,
            },
            pincode:{
                type:Number,
                min:6,
                max:6,
                required:true
            }
        }],
    },
    is_deleted:{
        type:boolean,
        default:false,
    },
    

});

const User = mongoose.model("users",userSchema);

module.exports = User;