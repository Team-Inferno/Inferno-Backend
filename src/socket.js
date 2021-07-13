const app = require("./app");

const http = require("http").Server(app);
const io = require("socket.io")(http);

io.on("connection", function (socket) {
  console.log("socket.io: User connected: ", socket.id);


  socket.on("text-message", (channel_id) => {
    console.log("text " + channel_id);
    socket.join(channel_id);
  });

  socket.on("new-server-added", (user_id) => {
    console.log("new server addeed" + user_id);
    socket.join(user_id);
  });

  socket.on("server-update", (server_id) => {
    console.log("server update" + server_id);
    socket.join(server_id);
  });

  socket.on("delete-server", (user_id) => {
    console.log("delete server" + user_id);
    socket.join(user_id);
  });

  socket.on("disconnect", () => {
    console.log("socket.io: User disconnected: ", socket.id);
  });
});

module.exports = io;
