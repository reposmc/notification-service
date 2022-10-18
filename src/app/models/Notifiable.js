const { mongoose } = require("mongoose");

const Notifiable = new mongoose.model("Notifiable", {
  endpoint: "String",
  expirationTime: {
    type: "Date",
    default: null,
  },
  keys: {
    p256dh: "String",
    auth: "String",
  },
});

module.exports = Notifiable;
