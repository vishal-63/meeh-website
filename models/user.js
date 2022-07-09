const mongoose = require("mongoose");
const { isEmail } = require("validator");

const addressSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  house_no: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
  },
  pincode: {
    type: Number,
    minlength: 6,
    maxlength: 6,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: isEmail,
    lowercase:true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  phone_no: {
    type: String,
    required: true,
  },
  adresses: {
    type: [addressSchema],
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
