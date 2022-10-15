const express = require("express");
const morgan = require("morgan");

const routes = require("./routes/index.routes");
const path = require("path");

//Get .env variables
// require("dotenv").config();

//Initialize the server
const app = express();

//Middleware
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

//Routes
app.use(routes);

//Static files
app.use(express.static(path.join(__dirname, "public")));

app.listen("3000", () => {
  console.log("Listen to port 3000");
});
