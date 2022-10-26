const { mongoose } = require("mongoose");

const Queue = new mongoose.model("Queue", {
  from: String,
  to: String,
  subject: String,
  html: String,
  attachments: Array,
  createdAt: Date,
});

module.exports = Queue;
