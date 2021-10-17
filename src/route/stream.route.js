const express = require("express");

const Stream = require("../controller/stream.controller");

const router = express.Router();

router.post("/register", Stream.register);
router.get("/profile", Stream.getProfile);
router.get("/search", Stream.streamerSearch);
router.get("/following", Stream.findFollower);
router.post("/follow", Stream.followStreamer);
router.post("/unfollow", Stream.unfollowStreamer);
router.get("/current", Stream.currentStream);
router.post("/key", Stream.setStreamKey);


module.exports = router;
