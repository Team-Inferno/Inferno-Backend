require("dotenv").config();
const app = require("./app");

app.listen(process.env.LOCALHOST_PORT || 8000,()=> {
    console.log(`listening to port ${process.env.LOCALHOST_PORT}`);
});