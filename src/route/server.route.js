const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const validate = require("../middleware/validate");
const {
  createServer,
  addMember,
  renameServer,
  deleteServer,
  createRoom,
  createChannel,
  deleteRoom,
  deleteChannel,
  getServer,
  renameRoom,
  renameChannel,
} = require("../controller/server.controller");


router.get(
  "/",
  [check("server_id").not().isEmpty().withMessage("server id is not provided")],
  validate,
  getServer
);

router.post(
  "/new/server",
  [
    check("server_name")
      .not()
      .isEmpty()
      .withMessage("Enter a valid server name"),
  ],
  validate,
  createServer
);

router.post(
  "/new/room",
  [
    check("room_name").not().isEmpty().withMessage("Enter a valid room name"),
    check("server_id").not().isEmpty().withMessage("No server ID provided"),
  ],
  validate,
  createRoom
);

router.post(
  "/new/channel",
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
  createChannel
);

router.post(
  "/new/member",
  [
    check("user_id").not().isEmpty().withMessage("User not valid"),
    check("server_id").not().isEmpty().withMessage("server not provided"),
  ],
  validate,
  addMember
);

router.post(
  "/rename/server",
  [
    check("server_id").not().isEmpty().withMessage("No server ID provided"),
    check("server_name").not().isEmpty().withMessage("Enter a valid server name"),
  ],
  validate,
  renameServer
);

router.post(
  "/rename/room",
  [
    check("server_id").not().isEmpty().withMessage("No server ID provided"),
    check("room_name").not().isEmpty().withMessage("Enter a valid room name"),
    check("room_id").not().isEmpty().withMessage("Enter a valid room id"),
  ],
  validate,
  renameRoom
);

router.post(
  "/rename/channel",
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
  renameChannel
);

router.post(
  "/delete/server",
  [check("server_id").not().isEmpty().withMessage("No server ID provided")],
  validate,
  deleteServer
);

router.post(
  "/delete/room",
  [
    check("server_id").not().isEmpty().withMessage("No server ID provided"),
    check("room_id").not().isEmpty().withMessage("No room ID provided"),
  ],
  validate,
  deleteRoom
);

router.post(
  "/delete/channel",
  [
    check("server_id").not().isEmpty().withMessage("No server ID provided"),
    check("room_id").not().isEmpty().withMessage("No room ID provided"),
    check("channel_id").not().isEmpty().withMessage("No channel ID provided"),
  ],
  validate,
  deleteChannel
);

module.exports = router;
