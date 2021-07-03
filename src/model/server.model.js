const mongoose = require("mongoose");
const { roomSchema, Room } = require("./room.schema");
const channel = require("./channel.model");

const serverSchema = new mongoose.Schema(
  {
    server_name: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rooms: [roomSchema],

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    image: {},

    totalMember: Number,
  },
  { timestamps: true }
);

serverSchema.pre("save", async function (next) {
  var server = this;

  if (server.isModified("rooms")) {
    return next();
  }

  var newTextChannel = new channel.TextChannel({
    channel_name: "text-channel",
  });

  var newVoiceChannel = new channel.VoiceChannel({
    channel_name: "voice-channel",
    subscribers: [server.owner],
  });

  await server.rooms.push(
    new Room({
      room_name: "General",
      channels: [newTextChannel, newVoiceChannel],
    })
  );

  next();
});

module.exports = mongoose.model("Servers", serverSchema);
