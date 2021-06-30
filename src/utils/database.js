const mongoose = require("mongoose");

exports.connectDB = () => {
  mongoose.promise = global.Promise;
  mongoose.connect(process.env.MONGO_CLOUD_CONN_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  const connection = mongoose.connection;
  connection.once("open", () =>
    console.log("MongoDB --  database connection established successfully!")
  );
  connection.on("error", (err) => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
    process.exit();
  });
};
