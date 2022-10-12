const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
require("dotenv").config();

const port = process.env.PORT;

const app = express();

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("connected to Mongo DB successfully"))
  .catch((error) => console.log("Unable to connect to Mongo. Error: ", error));

app.use(cors());

//body-parser for parsing JSON bodies
app.use(bodyParser.json());

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

app.use(userRouter);

app.use(errorHandler);

app.listen(3010, () =>
  console.log("Music store server is listening for requests...")
);
