const express = require("express");
const { check } = require("express-validator");

const {createServer,addMember,updateServer,deleteServer, createRoom, createChannel, deleteRoom, deleteChannel} = require("../controller/server.controller");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "You are in the Server Endpoint.",
  });
});

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
    check("channel_type").not().isEmpty().withMessage("No channel type provided"),
  ],
  validate,
  createChannel
);



router.post(
  "new/member",
  [check("user_id").not().isEmpty().withMessage("User not valid")],
  validate,
  addMember
);

router.post(
  "/rename",
  [
    check("serverid")
      .not()
      .isEmpty()
      .withMessage("No server ID provided"),
    check("newname")
      .not()
      .isEmpty()
      .withMessage("Enter a valid server name"),
  ],
  validate,
  updateServer
);

router.post(
  "/delete/server",
  [
    check("server_id").not().isEmpty().withMessage("No server ID provided"),
  ],
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
