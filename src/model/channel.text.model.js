const Channel = require("./channel.model");
const mongoose = require("mongoose");

const voiceChannelSchema = Channel.discriminator(
  "text",
  new mongoose.Schema(
    {
      conversation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Conversation",
      },
    }
  )
);

module.exports = mongoose.model(voiceChannelSchema);
