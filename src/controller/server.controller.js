const Server = require("../model/server.model");
const User = require("../model/user.model");

exports.createServer = async (req, res) => {
  try {
    const servername = req.query.servername;
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

exports.addMember = async (req, res) => {
  try {
    const userid = req.query.userid;
    const serverid = req.query.serverid;

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

exports.renameServer = async (req, res) => {
  try {
    const servername = req.query.newname;
    const serverid = req.query.serverid;

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

exports.deleteServer = async (req, res) => {
  try {
    const serverid = req.query.serverid;

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


