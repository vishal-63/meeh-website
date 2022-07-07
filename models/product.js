const mongoose = require("mongoose");

const reivewSchema = new mongoose.schema({
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        required:true,
    },
    comment:String,
})

const productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:mongoose.SchemaTypes.ObjectId,     
        required:true,  
    },
    size:{
        type:[String],
        required:true
    },
    color:{
        type:[String],
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    sub_category:{
        type:String,
        required:true,
    },
    discount:{
        type:Number,
    },
    reviews:{
        type:reivewSchema,
    },
    is_deleted:{
        type:Boolean,
        default:false,
    }
})

const Product = mongoose.model("products",productSchema);

module.exports = Product;