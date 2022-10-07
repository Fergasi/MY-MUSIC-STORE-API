const express = require("express");
const userModel = require("../models/userModel");

const userRouter = express.Router();

userRouter.post("/register-user", (req, res, next) => {
  console.log("req.body: ", req.body);

  const { firstName, lastName, email, password, profilePicture } = req.body;

  const userDocument = new userModel({
    firstName,
    lastName,
    email,
    password,
    profilePicture,
  });

  userDocument.save();

  res.send("route hit successfully");
});

module.exports = userRouter;
