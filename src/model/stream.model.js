const mongoose = require("mongoose");

const streamSchema = new mongoose.Schema(
  {
    streamer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    sender_name: {
      type: String,
    },
    content: {
      type: Buffer,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Messages", streamSchema);
