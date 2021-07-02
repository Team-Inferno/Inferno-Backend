const express = require("express");
const { check } = require("express-validator");

const {createServer,addMember,renameServer,deleteServer} = require("../controller/server.controller");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "You are in the Server Endpoint.",
  });
});

router.post(
  "/add",
  [
    check("servername")
      .not()
      .isEmpty()
      .withMessage("Enter a valid server name"),
  ],
  validate,
  createServer
);

router.post(
  "/member",
  [check("userid").not().isEmpty().withMessage("User not valid")],
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
  renameServer
);

router.post(
  "/delete",
  [
    check("serverid").not().isEmpty().withMessage("No server ID provided"),
  ],
  validate,
  deleteServer
);

module.exports = router;
