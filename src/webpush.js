const webpush = require("web-push");

//Get the variables in the .env
require("dotenv").config();

// console.log("Public key: "+process.env.VAPID_PUBLIC_KEY+"\nPrivate key:" +process.env.VAPID_PRIVATE_KEY)
webpush.setVapidDetails(
  "mailto:lopezleonel191@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = webpush;
