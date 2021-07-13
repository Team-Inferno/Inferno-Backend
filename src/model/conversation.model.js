const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    channel_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Channel",
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    sender_name: {
      type: String,
    },
    content: {
      type: String,
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("Messages", conversationSchema);
