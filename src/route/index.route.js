const auth = require("./auth.route");
const user = require("./user.route");
const server = require("./server.route");
const room = require("./room.route");
const conversation = require("./conversation.route");

const authenticate = require("../middleware/authenticate");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.status(200).send({
      message: "Welcome to Inferno.",
    });
  });

  app.use("/api/auth", auth);
  app.use("/api/user", authenticate, user);
  app.use("/api/server", authenticate, server);
  app.use("/api/room", authenticate, room);
  app.use("/api/conversation", authenticate, conversation)
};
