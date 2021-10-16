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
  /*var server = this;

  if (server.isModified("rooms")) {
    console.log("gg");
    next();
  }*/

  

  next();
});

module.exports = mongoose.model("Servers", serverSchema);
