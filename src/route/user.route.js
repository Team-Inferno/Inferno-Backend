const express = require("express");
const { check } = require("express-validator");

const User = require("../controller/user.controller");
const validate = require("../middleware/validate");

const router = express.Router();

//INDEX
router.get("/", User.index);

//SHOW
router.get("/:id", User.show);

//UPDATE
router.put("/:id", User.update);

//DELETE
router.delete("/:id", User.destroy);

module.exports = router;
