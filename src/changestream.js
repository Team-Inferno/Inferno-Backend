const mongoose = require("mongoose");
const io = require("./socket");

const serverChangeStream = mongoose.connection.collection("servers").watch();

serverChangeStream.on("change", (change) => {
  switch (change.operationType) {
    case "update":
      console.log("ggg");
      console.log(change.fullDocument._id);
      console.log(change.documentKey._id);
      //io.sockets.in(change.fullDocument._id).emit("updateServer", change.fullDocument);
      break;

    case "delete":
      io.in(change.documentKey._id).emit(
        "deletedThought",
        change.documentKey._id
      );
      break;
  }
});
