const Server = require("../model/server.model");
const User = require("../model/user.model");

const findIndex = (list, id) => {
  var index = list.findIndex((el) => el._id == id);
  return index;
};

exports.joinVoiceChannel = async function (req, res) {
  try {
    const channelID = req.query.channel_id;
    const serverID = req.query.server_id;
    const roomID = req.query.room_id;
    const userID = req.query.user_id;

    const server = await Server.findOne({ _id: serverID });
    if (!server)
      return res.status(401).json({ message: "Server does not exist" });

    const roomIndex = server.rooms.findIndex((room) => room._id == roomID);
    if (roomIndex == -1) {
      return res.status(401).json({ message: "invalid room id" });
    }

    //const roomIndex = findIndex(server.rooms, roomID);

    const channelIndex = server.rooms[roomIndex].channels.findIndex(
      (channel) => channel._id == channelID
    );
    if (channelIndex == -1) {
      return res.status(401).json({ message: "invalid channel id" });
    }

    const userIndex = server.rooms[roomIndex].channels[
      channelIndex
    ].subscribers.findIndex((user) => user._id == userID);
    if (userIndex != -1) {
      return res
        .status(401)
        .json({ message: "user already joined this voice channel" });
    }

    server.rooms[roomIndex].channels[channelIndex].subscribers.push(userID);

    await server.save();

    res.status(200).json({ message: "user joined successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};


exports.leaveVoiceChannel = async function (req, res) {
  try {
    const channelID = req.query.channel_id;
    const serverID = req.query.server_id;
    const roomID = req.query.room_id;
    const userID = req.query.user_id;

    const server = await Server.findOne({ _id: serverID });
    if (!server)
      return res.status(401).json({ message: "Server does not exist" });

    const roomIndex = server.rooms.findIndex((room) => room._id == roomID);
    if (roomIndex == -1) {
      return res.status(401).json({ message: "invalid room id" });
    }

    //const roomIndex = findIndex(server.rooms, roomID);

    const channelIndex = server.rooms[roomIndex].channels.findIndex(
      (channel) => channel._id == channelID
    );
    if (channelIndex == -1) {
      return res.status(401).json({ message: "invalid channel id" });
    }

    const userIndex = server.rooms[roomIndex].channels[
      channelIndex
    ].subscribers.findIndex((user) => user._id == userID);
    if (userIndex == -1) {
      return res
        .status(401)
        .json({ message: "user didnt join this voice channel" });
    }

    server.rooms[roomIndex].channels[channelIndex].subscribers.splice(
      userIndex,
      1
    );


    await server.save();

    res.status(200).json({ message: "user leaved successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};