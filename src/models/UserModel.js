const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, trim: true, unique: true },
  hashedPassword: { type: String, required: true },
  profilePicture: { type: String },
  isAdmin: { type: Boolean, required: true, default: false },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
