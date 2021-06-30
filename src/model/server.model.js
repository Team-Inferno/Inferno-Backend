const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rooms: [
      {
        name: {
          type: String,
          required: true,
        },

        channels: [
          {
            reference: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: "Channel",
            },
            name: {
              type: String,
            },
            type: {
              type: String,
              enum: ["voice", "text"],
              required: true,
            },
          },
        ],
      },
      { timestamps: true },
    ],

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

module.exports = mongoose.model("Servers", serverSchema);
