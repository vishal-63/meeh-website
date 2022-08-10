
const Coupon = require("../models/coupon");

module.exports.get_coupon_by_code = async (req,res)=>{
    res.send("First edit code");
}

module.exports.get_coupon_set = async (req,res)=>{
    const coupon = new Coupon({
        coupon_code:"FREEDELI",
        "min-total":380,
        amount:80,
    });
    await coupon.save();
    res.send("Done");
}