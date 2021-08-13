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

exports.createRoom = async (req, res) => {
  try {
    const roomname = req.query.room_name;
    const serverid = req.query.server_id;

    var server = await Server.findOne({ _id: serverid });
    if (!server) {
      return res
        .status(404)
        .json({ error: true, message: "server doesnt exist" });
    }

    server.rooms.push(
      new Room({
        room_name: String(roomname),
      })
    );

    await server.save();

    res.status(200).json({ message: "Room created", updatedServer: server });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const serverid = req.query.server_id;
    const roomid = req.query.room_id;

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

    server.rooms.splice(roomIndex, 1);
    await server.save();

    res.status(200).json({ error: false, message: "room deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.renameRoom = async (req, res) => {
  try {
    const roomName = req.query.room_name;
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
        room.room_name = roomName;
      }
    });
    await server.save();

    res.status(200).json({ error: false, message: "room name updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};