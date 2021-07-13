const User = require("../model/user.model");


exports.index = async function (req, res) {
  const users = await User.find({});
  res.status(200).json({ users });
};

exports.getServers = async function (req, res) {
  try {
    const id = req.query.user_id;

    const user = await User.findOne({ _id: id });

    if (!user) return res.status(401).json({ message: "User does not exist" });
    res.status(200).json({ servers: user.servers });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};


exports.removeServer = async function (req, res) {
  try {
    const userid = req.query.user_id;
    const serverid = req.query.server_id;

    var user = await User.findOne({ _id: userid });

    if (!user) {
      return res.status(404).json({ error: true, message: "user not found" });
    }

    var servers = user.servers;
    const serverIndex = servers.findIndex((server) => server._id == serverid);
    if (serverIndex == -1) {
      return res
        .status(404)
        .json({ error: true, message: "user is not a memeber of this server" });
    }
    user.servers.splice(serverIndex, 1);
    await user.save();
    res
      .status(200)
      .json({ error: false, message: "member removed from the server" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
