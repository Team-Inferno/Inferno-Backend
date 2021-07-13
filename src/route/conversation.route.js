const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const validate = require("../middleware/validate");

const { getConversation,createConversation } = require("../controller/conversation.controller");

router.get(
  "/",
  [
    check("channel_id")
      .not()
      .isEmpty()
      .withMessage("channel ID id is not provided"),
  ],
  validate,
  getConversation
);

router.post(
  "/",
  [
    check("channel_id")
      .not()
      .isEmpty()
      .withMessage("channel ID id is not provided"),
    check("sender").not().isEmpty().withMessage("sender id is not provided"),
    check("sender_name")
      .not()
      .isEmpty()
      .withMessage("sender name  is not provided"),
    check("content").not().isEmpty().withMessage("content is not provided"),
  ],
  validate,
  createConversation
);

module.exports = router;
