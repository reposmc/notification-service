const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");

require("dotenv").config();

const routes = require("./routes/index.routes");
const path = require("path");

require("./config/database");

//Initialize the server
const app = express();
require("./cron");

//Middleware
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(fileUpload());
app.use(express.json());

//Routes
app.use(routes);

//Static files
app.use(express.static(path.join(__dirname, "public")));

app.listen("3000", () => {
  console.log("Listen to port 3000");
});
