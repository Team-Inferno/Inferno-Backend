const mongoose = require("mongoose");
const channelSchema = require("./channel.schema");

const roomSchema = new mongoose.Schema(
  {
    room_name: {
      type: String,
    },

    channels: [channelSchema.baseChannelSchema],
  },
  { timestamps: true }
);

const Room = mongoose.model("Rooms", roomSchema);

module.exports = {roomSchema,Room};