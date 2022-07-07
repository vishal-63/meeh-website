const mongoose = require("mongoose");

const couponSchema=new mongoose.Schema({
    coupon_code:{
        type:String,
        required:true,
        minlength:4,
    },
    percentage:{
        type:Number,
        max:100,
    },
    max_discount:{
        type:Number,
    },
    min_total:{
        type:Number,
    },
    amount:{
        type:Number,
    },
    is_deleted:{
        type:Boolean,
        default:false,
    }
})

const Coupon = mongoose.model('coupon',couponSchema);

module.exports = Coupon;