const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const validate = require("../middleware/validate");
const {
  createServer,
  addMember,
  renameServer,
  deleteServer,
  getServer,
  getServerName,
} = require("../controller/server.controller");

router.get(
  "/name",
  getServerName
);

router.get(
  "/",
  [check("server_id").not().isEmpty().withMessage("server id is not provided")],
  validate,
  getServer
);

router.post(
  "/",
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
  "/new/member",
  [
    check("user_id").not().isEmpty().withMessage("User not valid"),
    check("server_id").not().isEmpty().withMessage("server not provided"),
  ],
  validate,
  addMember
);

router.post(
  "/rename",
  [
    check("server_id").not().isEmpty().withMessage("No server ID provided"),
    check("server_name").not().isEmpty().withMessage("Enter a valid server name"),
  ],
  validate,
  renameServer
);


router.post(
  "/delete",
  [check("server_id").not().isEmpty().withMessage("No server ID provided")],
  validate,
  deleteServer
);




module.exports = router;
