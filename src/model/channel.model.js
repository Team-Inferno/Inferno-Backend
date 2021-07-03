const roomSchema = require("./room.schema");
const channelSchema = require("./channel.schema");


const TextChannel = roomSchema.roomSchema
  .path("channels")
  .discriminator("text", channelSchema.TextChannelSchema);
const VoiceChannel = roomSchema.roomSchema
  .path("channels")
  .discriminator("voice", channelSchema.VoiceChannelSchema);

module.exports = {TextChannel,VoiceChannel}
