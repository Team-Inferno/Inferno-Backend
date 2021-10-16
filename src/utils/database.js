const mongoose = require("mongoose");
const io = require("../socket");

exports.connectDB = () => {
  mongoose.promise = global.Promise;
  mongoose.connect(process.env.MONGO_CLOUD_CONN_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  const connection = mongoose.connection;

  connection.once("open", () => {
    console.log("MongoDB --  database connection established successfully!");

    const userChangeStream = connection
      .collection("users")
      .watch({ fullDocument: "updateLookup" });

    userChangeStream.on("change", (change) => {
      switch (change.operationType) {
        case "update":
          console.log(change.fullDocument._id);
          io.to(String(change.fullDocument._id)).emit(
            "userUpdate",
            change.fullDocument
          );
          break;
      }
    });

    const serverChangeStream = connection
      .collection("servers")
      .watch({ fullDocument: "updateLookup" });

    serverChangeStream.on("change", (change) => {
      switch (change.operationType) {
        case "insert":
          io.to(String(change.documentKey._id)).emit(
            "serverUpdate",
            change.fullDocument
          );
          break;

        case "update":
          console.log("server update found");
          io.to(String(change.documentKey._id)).emit(
            "serverUpdate",
            change.fullDocument
          );
          break;
          

        case "delete":
          /*io.to(String(change.documentKey._id)).emit(
            "serverUpdate",
            change.documentKey._id
          );*/
          break;
      }
    });

    const conversationChangeStream = connection
      .collection("messages")
      .watch({ fullDocument: "updateLookup" });

    conversationChangeStream.on("change", (change) => {
      switch (change.operationType) {
        case "insert":
          io.to(String(change.fullDocument.channel_id)).emit(
            "new-conversation",
            change.fullDocument
          );
          break;
      }
    });
  });
  connection.on("error", (err) => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
    process.exit();
  });
};
