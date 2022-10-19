const express = require("express");
const {
  signOut,
  registerUser,
  signIn,
  updateFavorites,
} = require("../services/UserServices");

const userRouter = express.Router();

userRouter.post("/sign-in", signIn);

userRouter.get("/sign-out", signOut);

userRouter.post("/register-user", registerUser);

userRouter.post("/add-to-favorites", updateFavorites);

module.exports = userRouter;
