const webpush = require("web-push");

// console.log("Public key: "+process.env.VAPID_PUBLIC_KEY+"\nPrivate key:" +process.env.VAPID_PRIVATE_KEY)
webpush.setVapidDetails(
  "mailto:lopezleonel191@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = webpush;
