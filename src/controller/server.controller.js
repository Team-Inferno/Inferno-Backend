const Server = require("../model/server.model");
const User = require("../model/user.model");
const { Room } = require("../model/room.schema");
const channel = require("../model/channel.model");
const io = require("../socket");

exports.getServer = async (req, res) => {
  try {
    const serverid = req.query.server_id;
    var server = await Server.findOne({ _id: serverid });

    if (!server) {
      return res
        .status(404)
        .json({ error: true, message: "server doesnt exist" });
    }

    res.status(200).json(server);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.getServerName = async (req, res) => {
  try {
    const serverid = req.query.server_id;
    var server = await Server.findOne({ _id: serverid });

    if (!server) {
      return res
        .status(404)
        .json({ error: true, message: "server doesnt exist" });
    }

    res.status(200).json(server.server_name);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};

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
    var newTextChannel = new channel.TextChannel({
      channel_name: "text-channel",
    });

    var newVoiceChannel = new channel.VoiceChannel({
      channel_name: "voice-channel",
      subscribers: [],
    });

    await newServer.rooms.push(
      new Room({
        room_name: "General",
        channels: [newTextChannel, newVoiceChannel],
      })
    );
    newServer = await newServer.save();

    var user = await User.findOne({ _id: ownerID });
    if (!user) {
      return res.status(404).json({ error: true, message: "no user found" });
    }

    io.to(String(ownerID)).emit("server-added", {
      server_id: newServer._id,
      server_name: servername,
    });

    user.servers.push({ server_id: newServer._id, server_name: servername });
    await user.save();

    res.status(200).json({ message: "Server created", newServer: newServer });
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

    var users = await User.find({ _id: { $in: server.members } });
    console.log(users);
    users.map(async (user) => {
      const serverIndex = user.servers.findIndex(
        (server) => server._id == serverid
      );
      user.servers.splice(serverIndex, 1);
      var _user = await user.save();
      io.to(String(_user._id)).emit("server-deleted", _user.servers);
    });

    await server.remove();

    res.status(200).json({ error: false, message: "server deleted" });
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
    if (!user) {
      return res.status(404).json({ error: true, message: "user not found" });
    }

    var server = await Server.findOne({ _id: serverid });
    if (!server) {
      return res.status(404).json({ error: true, message: "server not found" });
    }

    var alreadyMember = false;
    server.members.map((member) => {
      if (String(member) == userid) {
        alreadyMember = true;
      }
    });
    if (alreadyMember) {
      return res
        .status(404)
        .json({ error: true, message: "user already member of this server" });
    }
    server.members.push(userid);
    await server.save();
    user.servers.push({ server_id: serverid, server_name: server.server_name });
    await user.save();

    io.to(String(userid)).emit("server-added", {
      server_id: server._id,
      server_name: server.server_name,
    });

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
    if (userIndex == -1) {
      return res
        .status(404)
        .json({ error: true, message: "user is not a memeber of this server" });
    }
    server.memebers.splice(userIndex, 1);
    await server.save();

    res
      .status(200)
      .json({ error: false, message: "member removed from the server" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.renameServer = async (req, res) => {
  try {
    const servername = req.query.server_name;
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
    server.server_name = servername;
    await server.save();

    res.status(200).json({ error: false, message: "server name updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};



