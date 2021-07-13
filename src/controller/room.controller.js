const Server = require("../model/server.model");
const User = require("../model/user.model");
const { Room } = require("../model/room.schema");
const channel = require("../model/channel.model");



exports.getRooms = async (req, res) => {
  try {
    const serverid = req.query.server_id;
    var server = await Server.findOne({ _id: serverid });

    if (!server) {
      return res
        .status(404)
        .json({ error: true, message: "server doesnt exist" });
    }

    res.status(200).json(server.rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};
