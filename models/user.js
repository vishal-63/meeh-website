const mongoose = require("mongoose");
const { isEmail, isStrongPassword } = require("validator");
const bcrypt = require("bcrypt");

const addressSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
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

const cartSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product",
  },
  quantity: Number,
  selected_size: String,
  selected_color: String,
});

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Please enter a first name"],
  },
  last_name: {
    type: String,
    required: [true, "Please enter a last name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter an email"],
    validate: [isEmail, "Please provide a valid email address"],
    lowercase: true,
  },
  password: {
    type: String,
    validate: [isStrongPassword, "Please provide a valid password"],
    minlength: 8,
  },
  googleId: String,
  phone_no: {
    type: String,
    minlength: [10, "Phone number must be 10 digits"],
    maxlength: [10, "Phone number must be 10 digits"],
  },
  addresses: {
    type: [addressSchema],
    required: false,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  cart: [cartSchema],

  wishlist: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Product",
    minlength: 1,
  },
  // forgot_password:{
  //   type:{
  //     otp:{
  //       type:Number,
  //       required:true,
  //     },
  //     expires_at:{
  //       type:Date,
  //       default:Date.now,
  //       expires:60,
  //     }
  //   }
  // }
});

// static method to login user
userSchema.statics.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (passwordMatched) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("This email address does not exist");
};

userSchema.statics.hashPassword = async (password) => {
  if (password != undefined) {
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    return password;
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;
