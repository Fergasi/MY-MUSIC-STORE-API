const express = require("express");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const cleanUser = (userDocument) => {
  return {
    id: userDocument._id,
    firstName: userDocument.firstName,
    lastName: userDocument.lastName,
    email: userDocument.email,
    profilePicture: userDocument.profilePicture,
    isAdmin: userDocument.isAdmin,
  };
};

const userRouter = express.Router();

userRouter.post("/register-user", async (req, res, next) => {
  //grab data from the request body
  const { firstName, lastName, email, password, profilePicture } = req.body;

  //hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userDocument = new UserModel({
      firstName,
      lastName,
      email,
      hashedPassword,
      profilePicture,
    });

    await userDocument.save();

    res.send({
      user: cleanUser(userDocument),
    });
  } catch (error) {
    if (error.keyValue.email) {
      res.status(409).json({
        message: `Failed to create account, ${error.keyValue.email} already exists`,
      });
    }
    //Express built-in error handling, see app.js middleware for custom errorHandling details
    next(error);
  }
});

userRouter.post("/sign-in", async (req, res, next) => {
  //get credential from the request
  const { email, password } = req.body.credentials;
  try {
    //check if user exists in DB
    const foundUser = await UserModel.findOne({ email: email });
    console.log("foundUser: ", foundUser);

    if (!foundUser) {
      return res
        .status(401)
        .json({ message: "User not found or incorrect credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      foundUser.hashedPassword
    );

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "User not found or incorrect credentials" });
    }

    res.send({
      user: cleanUser(foundUser),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
