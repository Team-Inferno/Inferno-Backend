const mongoose = require("mongoose");

const baseChannelSchema = new mongoose.Schema(
  {
    channel_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
  { discriminatorKey: "type" }
);

const TextChannelSchema = new mongoose.Schema({}, { discriminatorKey: "type" });

const VoiceChannelSchema = new mongoose.Schema(
  {
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }               
    ],
  },
  { discriminatorKey: "type" }
);

module.exports = { baseChannelSchema, TextChannelSchema, VoiceChannelSchema };
