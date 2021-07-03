const Server = require("../model/server.model");
const User = require("../model/user.model");
const { Room } = require("../model/room.schema");
const channel = require("../model/channel.model");

exports.createServer = async (req, res) => {
  try {
    const servername = req.query.server_name;
    const ownerID = req.user.id;
    var server = await Server.findOne({ server_name: servername });

    if (server) {
      return res
        .status(404)
        .json({ error: true, message: "server with this name already exists" });
    }

    var newServer = new Server({ server_name: servername, owner: ownerID });

    await newServer.members.push(ownerID);
    newServer = await newServer.save();

    res.status(200).json({ message: "Server created", newServer: newServer });
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

    res.status(200).json({ message: "Channel created", updatedServer: server });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.deleteServer = async (req, res) => {
  try {
    const serverid = req.query.server_id;

    var server = await Server.findOne({ _id: serverid });
    if (!server) {
      return res.status(404).json({ error: true, message: "server not found" });
    }

    if (String(server.owner) != String(req.user.id)) {
      return res
        .status(404)
        .json({ error: true, message: "Only owner can delete the server" });
    }

    await server.remove();

    res.status(200).json({ error: false, message: "server deleted" });
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

exports.addMember = async (req, res) => {
  try {
    const userid = req.query.user_id;
    const serverid = req.query.server_id;

    var user = await User.findOne({ _id: userid });
    var server = await Server.findOne({ _id: serverid });
    if (!user) {
      return res.status(404).json({ error: true, message: "user not found" });
    }

    if (!user.isVarified) {
      return res
        .status(404)
        .json({ error: true, message: "user not varified" });
    }

    if (!server) {
      return res.status(404).json({ error: true, message: "server not found" });
    }

    server.members.push(userid);
    await server.save();
    user.servers.push(serverid);
    await user.save();

    res.status(200).json({ error: false, message: "member added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const userid = req.query.user_id;
    const serverid = req.query.server_id;

    var server = await Server.findOne({ _id: serverid });
    if (!server) {
      return res.status(404).json({ error: true, message: "server not found" });
    }

    var members = server.memebers;
    const userIndex = members.findIndex((member) => member._id == userid);
    if (roomIndex == -1) {
      return res
        .status(404)
        .json({ error: true, message: "user is not a memeber of this server" });
    }
    server.memebers.splice(userIndex, 1);
    await server.save();

    res.status(200).json({ error: false, message: "member removed from the server" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.updateServer = async (req, res) => {
  try {
    const servername = req.query.new_name;
    const serverid = req.query.server_id;

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
    server.name = servername;
    await server.save();

    res.status(200).json({ error: false, message: "server name updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};
