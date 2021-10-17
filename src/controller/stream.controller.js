const Server = require("../model/server.model");
const User = require("../model/user.model");
var randomstring = require("randomstring");

exports.register = async function (req, res) {
  try {
    const userID = req.query.user_id;
    const user = await User.findOne({ _id: userID });

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    console.log(user.streamer);

    if (user.streamer) {
      return res.status(401).json({ message: "User already a streamer" });
    }

    user.streamer = true;
    await user.save();

    res.status(200).json({ message: "user registered as a streamer" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.followStreamer = async function (req, res) {
  try {
    const userID = req.query.user_id;
    const streamerID = req.query.streamer_id;
    const user = await User.findOne({ _id: userID });

    if (userID === streamerID) {
      return res.status(401).json({ message: "Cant follow yourself" });
    }

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const streamer = await User.findOne({ _id: streamerID });

    if (!streamer || !streamer.streamer) {
      return res.status(401).json({ message: "streamer does not exist" });
    }

    streamer.followers.push( userID );
    user.following.push( streamerID );

    await streamer.save();
    await user.save();

    res.status(200).json({ message: "user is now following the streamer" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.unfollowStreamer = async function (req, res) {
  try {
    const userID = req.query.user_id;
    const streamerID = req.query.streamer_id;
    const user = await User.findOne({ _id: userID });

    if (userID === streamerID) {
      return res.status(401).json({ message: "Cant follow yourself" });
    }

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const streamer = await User.findOne({ _id: streamerID });

    if (!streamer || !streamer.streamer) {
      return res.status(401).json({ message: "streamer does not exist" });
    }

    const followerIndex = streamer.followers.findIndex(
      (follower) => follower == user
    );
    streamer.followers.splice(followerIndex, 1);


    const streamerIndex = user.following.findIndex(
      (streamer) => streamer == streamerID
    );
    user.following.splice(streamerIndex, 1);

    await streamer.save();
    await user.save();

    res.status(200).json({ message: "user is now following the streamer" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async function (req, res) {
  try {
    const streamerID = req.query.streamer_id;
    const user = await User.findOne({ _id: streamerID });

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }
    if (!user.streamer) {
      return res.status(401).json({ message: "User is not a streamer" });
    }

    res.status(200).json({
      followers: user.followers,
      streams: user.streams,
      username: user.username,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.streamerSearch = async function (req, res) {
  try {
    const streamerQuery = req.query.streamer_query;
    console.log(streamerQuery);
    const user = await User.find({
      $and: [
        { streamer: true },
        { username: { $regex: ".*" + streamerQuery + ".*" } },
      ],
    });
    let result = [];
    user.forEach((el) => {
      result.push({ id: el._id, username: el.username });
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.findFollower = async function (req, res) {
  try {
    const streamerID = req.query.streamer_id;
    const userID = req.query.user_id;

    const streamer = await User.findOne({
      _id: streamerID,
    });
    if (!streamer) {
      return res.status(401).json({ message: "streamer does not exist" });
    }

    let following = false;
    const followers = streamer.followers;
    followers.map((follower) => {
      if (String(follower) === userID) {
        following = true;
      }
    });

    res.status(200).json(following);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.currentStream = async function (req, res) {
  try {
    const streamerID = req.query.streamer_id;

    const streamer = await User.findOne({
      _id: streamerID,
    });
    if (!streamer || !streamer.streamer) {
      return res.status(401).json({ message: "streamer does not exist" });
    }

    console.log(streamer.current_stream_id);
    
    res.status(200).json(streamer.current_stream_id);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.setStreamKey = async function (req, res) {
  try {
    const streamerID = req.query.streamer_id;
    const streamKey = req.query.stream_key;

    const streamer = await User.findOne({
      _id: streamerID,
    });
    if (!streamer || !streamer.streamer) {
      return res.status(401).json({ message: "streamer does not exist" });
    }

    streamer.current_stream_id = streamKey;
    await streamer.save();
    res.status(200).json({message: "streamer started streaming"});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

