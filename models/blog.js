const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  published_at: {
    type: Date,
    default: new Date().toLocaleDateString(),
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  tags:{
    type:[String],
    minlength:1,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

const Blog = mongoose.model("blogs", blogSchema);

module.exports = Blog;
