const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    server: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Server",
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
  { discriminatorKey: "type" }
);

module.exports = mongoose.model("Tokens", tokenSchema);
