const { mongoose } = require("mongoose");

const Queue = mongoose.model("Queue", {
  from: String,
  to: String,
  subject: String,
  html: String,
  attachments: Array,
  createdAt: Date,
});

module.exports = Queue;
