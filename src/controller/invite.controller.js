const Server = require("../model/server.model");
const User = require("../model/user.model");

exports.sendInvitation = async function (req, res) {
  try {
    const senderID = req.query.sender_id;
    const username = req.query.username;
    const serverID = req.query.server_id;

    const user = await User.findOne({ username: username });
    if (!user) return res.status(401).json({ message: "User does not exist" });

    const sender = await User.findOne({ _id: senderID });
    if (!sender)
      return res.status(401).json({ message: "sender does not exist" });

    const server = await Server.findOne({ _id: serverID });
    if (!server) return res.status(401).json({ message: "invalid server id" });

    const inviteIndex = user.invites.findIndex(
      (invite) => invite.sender_id == senderID && invite.server_id == serverID
    );
    if (inviteIndex != -1) {
      return res.status(401).json({ message: "invite already sent" });
    }

    const memberIndex = server.members.findIndex(
      (member) => String(member) == user._id
    );
    if (memberIndex != -1) {
      return res
        .status(401)
        .json({ message: "user already a member of this server" });
    }

    user.invites.push({ server_id: serverID, sender_id: senderID });
    await user.save();

    res.status(200).json({ message: "Invite sent" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.acceptInvitation = async function (req, res) {
  try {
    const userID = req.query.user_id;
    const inviteID = req.query.invite_id;

    const user = await User.findOne({ _id: userID });
    if (!user) return res.status(401).json({ message: "User does not exist" });

    const inviteIndex = user.invites.findIndex(
      (invite) => invite._id == inviteID
    );
    if (inviteIndex == -1) {
      return res.status(401).json({ message: "invalid invite id" });
    }
    const serverID = user.invites[inviteIndex].server_id;

    const server = await Server.findOne({ _id: serverID });
    if (!server) {
      return res.status(404).json({ error: true, message: "server not found" });
    }

    const memberIndex = server.members.findIndex(
      (member) => String(member) == user._id
    );
    if (memberIndex != -1) {
      server.members.push(userID);
    }

    const serverIndex = user.servers.findIndex(
      (server) => server.server_id === serverID
    );
    if (serverIndex != -1) {
      user.servers.push({
        server_id: serverID,
        server_name: server.server_name,
      });
    }

    user.invites.splice(inviteIndex, 1);

    await user.save();
    await server.save();

    res.status(200).json({ message: "Invite accepted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.declineInvitation = async function (req, res) {
  try {
    const userID = req.query.user_id;
    const inviteID = req.query.invite_id;

    const user = await User.findOne({ _id: userID });
    if (!user) return res.status(401).json({ message: "User does not exist" });

    const inviteIndex = user.invites.findIndex(
      (invite) => invite._id == inviteID
    );
    if (inviteIndex == -1) {
      return res.status(401).json({ message: "invalid invite id" });
    }

    user.invites.splice(inviteIndex, 1);

    await user.save();

    res.status(200).json({ message: "Invite declined" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
