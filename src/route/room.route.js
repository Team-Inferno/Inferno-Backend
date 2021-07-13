const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const validate = require("../middleware/validate");

const {getRooms} = require("../controller/room.controller")

router.get(
  "/",
  [check("server_id").not().isEmpty().withMessage("server id is not provided")],
  validate,
  getRooms
);

module.exports = router;
