const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const permissionServices = require("./PermissionServices");

//function to clean/standardize user data before returning to frontend
const cleanUser = (userDocument) => {
  return {
    id: userDocument._id,
    firstName: userDocument.firstName,
    lastName: userDocument.lastName,
    email: userDocument.email,
    profilePicture: userDocument.profilePicture,
    isAdmin: userDocument.isAdmin,
    favorites: userDocument.favorites,
  };
};

const getToken = (userId) => {
  //create user token
  return jwt.sign({ userId, iat: Date.now() }, process.env.AUTH_SECRET_KEY);
};

const signOut = (req, res, next) => {
  res.clearCookie("session_token");
  res.send("Signed out successfully");
};

const registerUser = async (req, res, next) => {
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

    const token = getToken(userDocument._id);

    res.cookie("session_token", token, { httpOnly: true, secure: false }); //httpOnly: true - doesn't allow javascript code to access the cookie on the frontend // secure: false - should be true when https implemented and released to prod

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
};

const signIn = async (req, res, next) => {
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

    const token = getToken(foundUser._id);
    //create session cookie
    res.cookie("session_token", token, { httpOnly: true, secure: false }); //httpOnly: true - doesn't allow javascript code to access the cookie on the frontend // secure: false - should be true when https implemented and released to prod

    res.send({
      user: cleanUser(foundUser),
    });
  } catch (error) {
    next(error);
  }
};

const updateFavorites = async (req, res, next) => {
  try {
    permissionServices.verifyUserLoggedIn(req, res);

    const { productId } = req.body;

    if (req.user.favorites.includes(productId)) {
      req.user.favorites.pull(productId);
      await req.user.save();
      return res.send({ user: cleanUser(req.user) });
    }

    req.user.favorites.push(productId);

    await req.user.save();

    res.send({ user: cleanUser(req.user) });
  } catch (error) {
    next(error);
  }
};

const userServices = { signIn, registerUser, signOut, updateFavorites };

module.exports = userServices;
