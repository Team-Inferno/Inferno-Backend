const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Channel",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
    },
    createdAt: {
      date: Date.now(),
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Messages", conversationSchema);
