const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
