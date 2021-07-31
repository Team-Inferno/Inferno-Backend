const express = require("express");

const Channel = require("../controller/channel.controller");

const router = express.Router();

router.post("/voice/join", Channel.joinVoiceChannel);
router.post("/voice/leave", Channel.leaveVoiceChannel);

module.exports = router;
