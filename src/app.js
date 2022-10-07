const bodyParser = require("body-parser");
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

//body-parser for parsing JSON bodies
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.send("hello world");
// });

app.use(userRouter);

app.listen(3010, () =>
  console.log("Music store server is listening for requests...")
);
