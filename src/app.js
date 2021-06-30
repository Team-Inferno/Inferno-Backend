const express = require("express");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const {connectDB} = require("./utils/database");
//=== 1 - CREATE APP
// Creating express app and configuring middleware needed for authentication
const app = express();

app.use(cors());

// for parsing application/json
app.use(express.json());


// for parsing application/xwww-
app.use(express.urlencoded({ extended: false }));

connectDB();

//INITIALIZE PASSPORT MIDDLEWARE
app.use(passport.initialize());
require("./middleware/jwt")(passport);

require("./route/index.route")(app);

module.exports = app;
