const express = require("express");

const User = require("../controller/user.controller");

const router = express.Router();

router.get("/server", User.getServers);
router.get("/profile", User.getProfile);
router.get("/invites", User.getInvites);
router.get("/name", User.getName);
router.get("/streamer", User.isStreamer);
router.post("/name", User.setName);


module.exports = router;
