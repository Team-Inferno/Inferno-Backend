require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const path = require("path");

//=== 1 - CREATE APP
// Creating express app and configuring middleware needed for authentication
const app = express();

app.use(cors());

// for parsing application/json
app.use(express.json());

// for parsing application/xwww-
app.use(express.urlencoded({ extended: false }));

mongoose.promise = global.Promise;
mongoose.connect(process.env.MONGO_CLOUD_CONN_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () =>
  console.log("MongoDB --  database connection established successfully!")
);
connection.on("error", (err) => {
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running. " + err
  );
  process.exit();
});

//INITIALIZE PASSPORT MIDDLEWARE
app.use(passport.initialize());
require("./middleware/jwt")(passport);

require("./route/index.route")(app);


app.listen(process.env.LOCALHOST_PORT || 8000,()=> {
    console.log(`listening to port ${process.env.LOCALHOST_PORT}`);
});