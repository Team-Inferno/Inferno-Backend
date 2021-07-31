const express = require("express");

const Invite = require("../controller/invite.controller");

const router = express.Router();

router.post("/send", Invite.sendInvitation);
router.post("/accept", Invite.acceptInvitation);
router.post("/decline", Invite.declineInvitation);

//router.get("/profile", User.getProfile);
//router.get("/invites", User.getInvites);

module.exports = router;
