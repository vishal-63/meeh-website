const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Test1 = mongoose.model("test1", testSchema);

module.exports = Test1;