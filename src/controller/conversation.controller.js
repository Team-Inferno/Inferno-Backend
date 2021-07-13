const Server = require("../model/server.model");
const User = require("../model/user.model");
const { Room } = require("../model/room.schema");
const channel = require("../model/channel.model");
const Conversation = require("../model/conversation.model");

exports.getConversation = async (req, res) => {
  try {
    const channelid = req.query.channel_id;
    var conversation = await Conversation.find({ channel_id: channelid });
    console.log(conversation.length);
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const channelid = req.query.channel_id;
    var conversation = new Conversation({
      channel_id: channelid,
      sender_id: req.query.sender,
      sender_name: req.query.sender_name,
      content: req.query.content,
    });

    await conversation.save();
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};
