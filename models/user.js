const mongoose = require("mongoose");
const { isEmail, isStrongPassword } = require("validator");
const bcrypt = require("bcrypt");

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
    required: [true, "Please enter a password"],
    validate: [isStrongPassword, "Please provide a valid password"],
    minlength: 8,
  },
  phone_no: {
    type: String,
    minlength: [10, "Phone number must be 10 digits"],
    maxlength: [10, "Phone number must be 10 digits"],
    required: [true, "Please enter a phone number"],
  },
  adresses: {
    type: [addressSchema],
    required: false,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

userSchema.statics.login = async (email, password) => {
  const user = await Users.findOne({ email: email });
  if (user) {
    if (user.password == password) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("No user found");
};

// fire a function before a document is saved in the database
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next(); // do not remove this
});

const Users = mongoose.model("user", userSchema);

module.exports = Users;
