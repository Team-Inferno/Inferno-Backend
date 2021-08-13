const Server = require("../model/server.model");
const User = require("../model/user.model");


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

exports.createChannel = async (req, res) => {
  try {
    const channelname = req.query.channel_name;
    const serverid = req.query.server_id;
    const roomid = req.query.room_id;
    const channeltype = req.query.channel_type;

    var server = await Server.findOne({ _id: serverid });
    if (!server) {
      return res
        .status(404)
        .json({ error: true, message: "server doesnt exist" });
    }

    const rooms = server.rooms;
    const roomIndex = rooms.findIndex((room) => room._id == roomid);

    if (roomIndex == -1) {
      return res
        .status(404)
        .json({ error: true, message: "room doesnt exist" });
    }
    var newChannel;
    if (channeltype == "text") {
      newChannel = new channel.TextChannel({
        channel_name: channelname,
      });
    } else {
      newChannel = new channel.VoiceChannel({
        channel_name: channelname,
      });
    }
    server.rooms[roomIndex].channels.push(newChannel);

    await server.save();

    res.status(200).json({
      error: false,
      message: "Channel created",
      updatedServer: server,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.deleteChannel = async (req, res) => {
  try {
    const serverid = req.query.server_id;
    const roomid = req.query.room_id;
    const channelid = req.query.channel_id;

    var server = await Server.findOne({ _id: serverid });
    if (!server) {
      return res.status(404).json({ error: true, message: "server not found" });
    }

    const rooms = server.rooms;
    const roomIndex = rooms.findIndex((room) => room._id == roomid);

    if (roomIndex == -1) {
      return res
        .status(404)
        .json({ error: true, message: "room doesnt exist" });
    }

    const channels = server.rooms[roomIndex].channels;
    const channelIndex = channels.findIndex(
      (channel) => channel._id == channelid
    );

    if (channelIndex == -1) {
      return res
        .status(404)
        .json({ error: true, message: "channel doesnt exist" });
    }

    server.rooms[roomIndex].channels.splice(channelIndex, 1);
    await server.save();

    res.status(200).json({ error: false, message: "channel deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.renameChannel = async (req, res) => {
  try {
    const channelName = req.query.channel_name;
    const channelID = req.query.channel_id;
    const serverid = req.query.server_id;
    const roomID = req.query.room_id;
    const user = req.user;

    var server = await Server.findOne({ _id: serverid });
    if (!server) {
      return res.status(404).json({ error: true, message: "server not found" });
    }

    if (String(server.owner) !== String(user.id)) {
      return res
        .status(404)
        .json({ error: true, message: "Only owner can rename the server" });
    }

    server.rooms.filter((room) => {
      if (room._id == roomID) {
        room.channels.filter((channel) => {
          if (channel._id == channelID) {
            channel.channel_name = channelName;
          }
        });
      }
    });
    await server.save();

    res.status(200).json({ error: false, message: "room name updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};