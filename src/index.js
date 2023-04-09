const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cors = require("cors");

require("dotenv").config();

const routes = require("./routes/index.routes");
const { registerService } = require("./libs/service");

require("./config/database");

//Initialize the server
const app = express();
require("./cron");

//Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(fileUpload());
app.use(cors());

//Routes
app.use(routes);

//Static files
// app.use(express.static(path.join(__dirname, "public")));

app.listen(process.env.PORT, process.env.SERVICE_NAME, async () => {
  await registerService();
  console.log("Listen to port 3003");
});
