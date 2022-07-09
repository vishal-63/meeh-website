const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  test1_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Test1",
    required: true,
  },
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;