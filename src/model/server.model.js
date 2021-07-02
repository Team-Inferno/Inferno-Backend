const mongoose = require("mongoose");
const channelSchema = require("../model/channel.model");

const roomSchema = new mongoose.Schema(
  {
    room_name: {
      type: String,
    },

    channels: [channelSchema.baseChannelSchema],
  },
  { timestamps: true }
);

const TextChannel = roomSchema
  .path("channels")
  .discriminator("text", channelSchema.TextChannelSchema);
const VoiceChannel = roomSchema
  .path("channels")
  .discriminator("voice", channelSchema.VoiceChannelSchema);

const Room = mongoose.model("Rooms", roomSchema);

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

  if (server.isModified(server.rooms)) {
    next();
  }

  await server.rooms.push(new Room({ room_name: "General" }));

  var newTextChannel = new TextChannel({
    channel_name: "text-channel",
  });

  var newVoiceChannel = new VoiceChannel({
    channel_name: "voice-channel",
    subscribers: [server.owner],
  });

  await server.rooms[0].channels.push(newTextChannel);
  await server.rooms[0].channels.push(newVoiceChannel);

  console.log(server);
  next();
});

serverSchema.pre(
  "remove",
  { query: true, document: true },
  async function (next) {
    var server = this;

    await Channel.deleteMany({ server: server._id });
    next();
  }
);

module.exports = mongoose.model("Servers", serverSchema);
