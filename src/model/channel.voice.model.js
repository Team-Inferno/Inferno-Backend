const Channel = require("./channel.model");
const mongoose = require("mongoose");

const voiceChannelSchema = Channel.discriminator(
  "voice",
  new mongoose.Schema({
    Subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  })
);

module.exports = mongoose.model(voiceChannelSchema);
