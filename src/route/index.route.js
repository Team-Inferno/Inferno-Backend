const auth = require("./auth.route");
const user = require("./user.route");
const server = require("./server.route");

const authenticate = require("../middleware/authenticate");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res
      .status(200)
      .send({
        message:
          "Welcome to Inferno.",
      });
  });

  app.use("/api/auth", auth);
  app.use("/api/user", authenticate, user);
  app.use("/api/server", server);
};
