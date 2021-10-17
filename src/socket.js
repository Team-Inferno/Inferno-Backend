const app = require("./app");

const http = require("http").Server(app);
const io = require("socket.io")(http);

io.on("connection", function (socket) {
  socket.emit("my-socket-id", socket.id);

  socket.on("text-message", (channel_id) => {
    socket.join(channel_id);
  });

  socket.on("new-server-added", (user_id) => {
    socket.join(user_id);
  });

  socket.on("server-update", (server_id) => {
    socket.join(server_id);
  });

  socket.on("delete-server", (user_id) => {
    socket.join(user_id);
  });

  socket.on("join-voice-channel", ({ channelID, userID }) => {
    socket.broadcast.to(channelID).emit("voice-channel-joined", userID);
    socket.join(channelID);
    console.log(userID + " joined");
  });

  socket.on("leave-voice-channel", ({ channel_id, userID }) => {
    io.to(channel_id).emit("voice-channel-left", userID);
  });

  socket.on("disconnect", () => {
    console.log("socket.io: User disconnected: ", socket.id);
  });

  socket.on("streamer", (streamer_id) => {
    socket.join(streamer_id);
  });

  socket.on("end-stream", ({ streamer_id}) => {
    //console.log(streaming_id);
    io.in(streamer_id).emit("stream-ended", streamer_id);
  });

  socket.on("streamer-streaming", ({streamer_id, streaming_id}) => {
    io.in(streamer_id).emit("stream-started", streaming_id);
  });
});

module.exports = io;
