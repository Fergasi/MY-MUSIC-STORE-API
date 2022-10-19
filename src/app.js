const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
require("dotenv").config();
const UserModel = require("./models/userModel");
const jwt = require("jsonwebtoken");
const productRouter = require("./routes/productRouter");

const port = process.env.PORT;

const app = express();

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("connected to Mongo DB successfully"))
  .catch((error) => console.log("Unable to connect to Mongo. Error: ", error));

//setup cors policy specified for cookies and server origin
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(cookieParser());

//body-parser for parsing JSON bodies
app.use(bodyParser.json());

//Authorization Middleware
app.use(async (req, res, next) => {
  try {
    const { session_token: sessionToken } = req.cookies;

    if (!sessionToken) {
      return next();
    }

    //this returns the jwt data or throws an eror
    const { userId, iat } = jwt.verify(
      sessionToken,
      process.env.AUTH_SECRET_KEY
    );

    //if token is older than 30 days we reject it.
    if (iat < Date.now() - 30 * 24 * 60 * 60 * 1000) {
      return res.status(401).json({ message: "Token has expired" });
    }

    //find the user in the DB
    const foundUser = await UserModel.findOne({ _id: userId });

    if (!foundUser) {
      return next();
    }
    //after finding the user in the token we add the user to every request object
    req.user = foundUser;

    return next();
  } catch (error) {
    next(error);
  }
});

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    console.log("----> Error Hanlder: ", error);
  } else {
    res.status(500).json({
      message: "Sorry something went wrong...",
    });
    console.log("----> Error Hanlder: ", error);
  }
};

//user routes
app.use(userRouter);

//product routes
app.use(productRouter);

app.use(errorHandler);

app.listen(3010, () =>
  console.log("Music store server is listening for requests...")
);
