const express = require("express");

const User = require("../controller/user.controller");

const router = express.Router();



router.get("/server", User.getServers);



module.exports = router;
