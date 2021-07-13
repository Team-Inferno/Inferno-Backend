const express = require("express");
const cors = require("cors");
const passport = require("passport");
const {connectDB} = require("./utils/database");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB();

app.use(passport.initialize());

require("./middleware/jwt")(passport);
require("./route/index.route")(app);



module.exports = app;
