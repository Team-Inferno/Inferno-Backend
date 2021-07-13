require("dotenv").config();
const app = require("./app");
const io = require("./socket");

app.listen(process.env.LOCALHOST_PORT || 8080, () => {
  console.log(`listening to port ${process.env.LOCALHOST_PORT}`);
});

io.listen(9090, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
