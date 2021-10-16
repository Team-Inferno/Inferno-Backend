const express = require("express");
const { check } = require("express-validator");
const validate = require("../middleware/validate");
const router = express.Router();

const Channel = require("../controller/channel.controller");


router.post("/voice/join", Channel.joinVoiceChannel);
router.post("/voice/leave", Channel.leaveVoiceChannel);
router.post(
  "/",
  [
    check("channel_name")
      .not()
      .isEmpty()
      .withMessage("Enter a valid channel name"),
    check("server_id").not().isEmpty().withMessage("No server ID provided"),
    check("room_id").not().isEmpty().withMessage("No server ID provided"),
    check("channel_type")
      .not()
      .isEmpty()
      .withMessage("No channel type provided"),
  ],
  validate,
  Channel.createChannel
);

router.post(
  "/rename",
  [
    check("server_id").not().isEmpty().withMessage("No server ID provided"),
    check("channel_name")
      .not()
      .isEmpty()
      .withMessage("Enter a valid channel name"),
    check("room_id").not().isEmpty().withMessage("Enter a valid room id"),
    check("channel_id").not().isEmpty().withMessage("Enter a valid channel id"),
  ],
  validate,
  Channel.renameChannel
);

router.post(
  "/delete",
  [
    check("server_id").not().isEmpty().withMessage("No server ID provided"),
    check("room_id").not().isEmpty().withMessage("No room ID provided"),
    check("channel_id").not().isEmpty().withMessage("No channel ID provided"),
  ],
  validate,
  Channel.deleteChannel
);
module.exports = router;
