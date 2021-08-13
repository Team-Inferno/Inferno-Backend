const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const validate = require("../middleware/validate");

const {getRooms,createRoom,renameRoom,deleteRoom} = require("../controller/room.controller")

router.get(
  "/",
  [check("server_id").not().isEmpty().withMessage("server id is not provided")],
  validate,
  getRooms
);

router.post(
  "/",
  [
    check("room_name").not().isEmpty().withMessage("Enter a valid room name"),
    check("server_id").not().isEmpty().withMessage("No server ID provided"),
  ],
  validate,
  createRoom
);

router.post(
  "/rename",
  [
    check("server_id").not().isEmpty().withMessage("No server ID provided"),
    check("room_name").not().isEmpty().withMessage("Enter a valid room name"),
    check("room_id").not().isEmpty().withMessage("Enter a valid room id"),
  ],
  validate,
  renameRoom
);

router.post(
  "/delete",
  [
    check("server_id").not().isEmpty().withMessage("No server ID provided"),
    check("room_id").not().isEmpty().withMessage("No room ID provided"),
  ],
  validate,
  deleteRoom
);

module.exports = router;
